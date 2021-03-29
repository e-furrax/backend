import { config } from 'dotenv';
import { S3 } from 'aws-sdk';
config();

const S3Config = {
    s3: {
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: process.env.AWS_S3_REGION,
        params: {
            ACL: 'public-read',
            Bucket: process.env.AWS_S3_BUCKET,
        },
    },
    app: {
        storageDir: 'tmp',
    },
};

export default new S3(S3Config.s3);
