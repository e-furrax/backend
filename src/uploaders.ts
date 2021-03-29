import s3 from './configs/s3';
import { S3Uploader } from './libs/gql-uploaders';

export const avatarUploader = new S3Uploader(s3, {
    baseKey: 'users/avatars',
    uploadParams: {
        CacheControl: 'max-age:31536000',
        ContentDisposition: 'inline',
    },
    filenameTransform: (filename: string) => filename,
});
