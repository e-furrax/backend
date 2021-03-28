declare global {
    namespace NodeJS {
        interface ProcessEnv {
            AWS_ACCESS_KEY_ID: string;
            AWS_SECRET_ACCESS_KEY: string;
            AWS_DEFAULT_REGION: string;
            AWS_S3_BUCKET: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
