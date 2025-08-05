import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export declare class FilePickerService {
    private sanitizer;
    constructor(sanitizer: DomSanitizer);
    mockUploadFile(formData: any): Observable<any>;
    createSafeUrl(file: any): SafeResourceUrl;
    static ɵfac: i0.ɵɵFactoryDeclaration<FilePickerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FilePickerService>;
}
