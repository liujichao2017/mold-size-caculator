'use server';

import { validators,  type UserInput, type CalculationResult,  } from '@/types';
import { createMoldCalculator } from '@/lib/mold-calculator';
// import { Upload } from '@aws-sdk/lib-storage';
// import { S3Client } from '@aws-sdk/client-s3';
// import { writeFile, mkdir } from 'fs/promises';
// import { join } from 'path';

// 下面这个是暂时定义的，所以没写到types.ts，后面可能需要修改
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// const dimensionsWithLayoutSchemaNew = z.object({
//   length: z.number(),
//   width: z.number(),
//   height: z.number(),
//   bottom: z.number(),
//   right: z.number(),
// });


export async function calculateMold(data: UserInput): Promise<CalculationResult> {
  try {

    console.log("request data: ", data)
    // Parse and validate input JSON
    const parsedInput = JSON.parse(data.jsonInput) as unknown;
    const validatedInput = validators.validateQuote(parsedInput);

    // Create calculator instance
    const calculator = await createMoldCalculator(
      validatedInput.products.map(product => {
        return {
          ...product.dimensions,
          productMaterial: product.productMaterial,
        }
       }),
      validatedInput.mold.moldMaterial
    );

    // Calculate mold size
    const moldLayout = calculator.calculateMoldSize();

    
    // console.log('moldLayout:', moldLayout);
    if (!moldLayout) {
      return {
        success: false,
        error: 'Could not find a valid mold layout',
      };
    }

    const productLayout = await calculator.calculateLayoutSpacing();
    // console.log('productLayout:', productLayout);


    // Calculate price
    const {moldWeight, moldPrice} = await calculator.calculateMoldPrice();

    const productPrice = await calculator.calculateProductPrice();

    console.log('productPrice:', productPrice);
    return {
      success: true,
      mold: moldLayout,
      moldPrice,
      moldWeight,
      productLayout: JSON.stringify(productLayout),
      productPrice: JSON.stringify(productPrice),
      
    };
  } catch (error) {
    console.error('Calculation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// 添加上传目标类型
// type UploadTarget = 'local' | 's3';

// interface FileUploadResult {
//   success: boolean;
//   error?: string;
//   filename?: string;
//   size?: number;
//   url?: string;  // 添加 url 字段用于 S3 上传后的访问链接
// }

// // 创建 S3 客户端
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION ?? 'us-east-1',
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
//   },
// });

// // 上传到 S3 的辅助函数
// async function uploadToS3(file: File, filename: string): Promise<string> {
//   const upload = new Upload({
//     client: s3Client,
//     params: {
//       Bucket: process.env.AWS_S3_BUCKET ?? '',
//       Key: `uploads/${filename}`,
//       Body: Buffer.from(await file.arrayBuffer()),
//       ContentType: file.type,
//     },
//   });

//   await upload.done();
  
//   return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${filename}`;
// }

// // 上传到本地的辅助函数
// async function uploadToLocal(file: File, filename: string): Promise<string> {
//   const uploadDir = join(process.cwd(), 'public', 'uploads');
  
//   // 确保上传目录存在
//   await mkdir(uploadDir, { recursive: true });
  
//   const filePath = join(uploadDir, filename);
//   const buffer = Buffer.from(await file.arrayBuffer());
//   await writeFile(filePath, buffer);
  
//   return `/uploads/${filename}`;
// }

// export async function handleFileUpload(
//   formData: FormData, 
//   target: UploadTarget = 'local'
// ): Promise<FileUploadResult> {
//   try {
//     const file = formData.get('file') as File;
    
//     if (!file) {
//       return {
//         success: false,
//         error: 'No file provided'
//       };
//     }

//     // 验证文件大小 (例如限制为 10MB)
//     const maxSize = 10 * 1024 * 1024; // 10MB in bytes
//     if (file.size > maxSize) {
//       return {
//         success: false,
//         error: 'File size exceeds 10MB limit'
//       };
//     }

//     // 获取安全的文件名
//     const timestamp = Date.now();
//     const safeFilename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

//     let fileUrl: string;

//     // 根据 target 选择上传方式
//     if (target === 's3') {
//       fileUrl = await uploadToS3(file, safeFilename);
//     } else {
//       fileUrl = await uploadToLocal(file, safeFilename);
//     }
    
//     return {
//       success: true,
//       filename: safeFilename,
//       size: file.size,
//       url: fileUrl
//     };
//   } catch (error) {
//     console.error('File upload error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error)
//     };
//   }
// } 