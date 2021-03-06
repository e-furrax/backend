import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import s3 from '@/configs/s3';

const uuidFilenameTransform = (filename = ''): string => {
    const fileExt = path.extname(filename);
    return `${uuidv4()}${fileExt}`;
};

class S3Uploader {
    private _s3: S3;
    private _baseKey: string;
    private _filenameTransform: any;
    private _uploadParams: any;
    private _concurrencyOptions: any;
    constructor(s3: S3, config: any) {
        const {
            baseKey = '',
            uploadParams = {},
            concurrencyOptions = {},
            filenameTransform = uuidFilenameTransform,
        } = config;

        this._s3 = s3;
        this._baseKey = baseKey.replace('/$', '');
        this._filenameTransform = filenameTransform;
        this._uploadParams = uploadParams;
        this._concurrencyOptions = concurrencyOptions;
    }

    async upload(
        stream: any,
        { filename, mimetype }: { filename: string; mimetype: string }
    ) {
        const transformedFilename = this._filenameTransform(filename);
        const { Location } = await this._s3
            .upload(
                {
                    ...this._uploadParams,
                    Body: stream,
                    Key: `${this._baseKey}/${transformedFilename}`,
                    ContentType: mimetype,
                    Bucket: process.env.AWS_S3_BUCKET,
                },
                this._concurrencyOptions
            )
            .promise();

        return Location;
    }
}

export const avatarUploader = new S3Uploader(s3, {
    baseKey: 'users/avatars',
    uploadParams: {
        CacheControl: 'max-age:31536000',
        ContentDisposition: 'inline',
    },
    filenameTransform: (filename: string) => filename,
});
