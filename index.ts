import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize S3 Client
const s3 = new S3Client({
    region: "us-east-1",
});

// Function to Upload File to S3
async function uploadFileToS3(filePath: string, bucketName: string, s3Key: string): Promise<void> {
    console.log("🚀 Upload started...");

    // Normalize the file path using path.join()
    const resolvedFilePath = path.join(__dirname, filePath);

    // Check if file exists
    if (!fs.existsSync(resolvedFilePath)) {
        console.error(`❌ Error: File not found at ${resolvedFilePath}`);
        return;
    }

    // Read file stream
    const fileStream = fs.createReadStream(resolvedFilePath);

    const uploadParams = {
        Bucket: bucketName,
        Key: s3Key,
        Body: fileStream,
        ContentType: "video/mp4", // ✅ Ensures streaming instead of downloading
    };

    const upload = new Upload({
        client: s3,
        params: uploadParams,
        partSize: 10 * 1024 * 1024, // 10MB chunks
        leavePartsOnError: true,
    });

    upload.on("httpUploadProgress", (progress) => {
        const loaded = progress.loaded ?? 0;
        const total = progress.total ?? 1;
        const percentage = ((loaded / total) * 100).toFixed(2);
        console.log(`📤 Upload progress: ${percentage}%`);
    });

    try {
        await upload.done();
        console.log("✅ Upload completed successfully!");
    } catch (error) {
        console.error("❌ Upload failed:", error);
    }
}

// Call the function to upload
const filePath = "./data/27_january_part_1.mp4"; // Change to actual file path
const bucketName = "training.clothovia.com";
const s3Key = `facebook-ads/day1/${path.basename(filePath)}`;

uploadFileToS3(filePath, bucketName, s3Key);
