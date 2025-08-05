import { FilePreviewModel } from '../../file-preview.model';
import * as i0 from "@angular/core";
export declare class FileValidatorService {
    constructor();
    /** Validates file extension */
    isValidExtension(fileName: string, fileExtensions: string[]): boolean;
    /** Validates if upload type is single so another file cannot be added */
    isValidUploadType(files: FilePreviewModel[], uploadType: string): boolean;
    /** Validates max file count */
    isValidMaxFileCount(fileMaxCount: number, newFiles: File[], files: FilePreviewModel[]): boolean;
    isValidFileSize(size: number, fileMaxSize: number): boolean;
    isValidTotalFileSize(newFile: File, files: FilePreviewModel[], totalMaxSize: number): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileValidatorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FileValidatorService>;
}
