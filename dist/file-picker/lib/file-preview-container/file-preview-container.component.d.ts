import { OnInit, EventEmitter, TemplateRef } from '@angular/core';
import { FilePreviewModel } from '../file-preview.model';
import { FilePickerAdapter } from '../file-picker.adapter';
import { UploaderCaptions } from '../uploader-captions';
import { HttpErrorResponse } from '@angular/common/http';
import * as i0 from "@angular/core";
export declare class FilePreviewContainerComponent implements OnInit {
    previewFiles: FilePreviewModel[];
    itemTemplate: TemplateRef<any>;
    enableAutoUpload: boolean;
    readonly removeFile: EventEmitter<FilePreviewModel>;
    readonly uploadSuccess: EventEmitter<FilePreviewModel>;
    readonly uploadFail: EventEmitter<HttpErrorResponse>;
    lightboxFile: FilePreviewModel;
    adapter: FilePickerAdapter;
    captions: UploaderCaptions;
    constructor();
    ngOnInit(): void;
    openLightbox(file: FilePreviewModel): void;
    closeLightbox(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FilePreviewContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FilePreviewContainerComponent, "file-preview-container", never, { "previewFiles": { "alias": "previewFiles"; "required": false; }; "itemTemplate": { "alias": "itemTemplate"; "required": false; }; "enableAutoUpload": { "alias": "enableAutoUpload"; "required": false; }; "adapter": { "alias": "adapter"; "required": false; }; "captions": { "alias": "captions"; "required": false; }; }, { "removeFile": "removeFile"; "uploadSuccess": "uploadSuccess"; "uploadFail": "uploadFail"; }, never, never, false, never>;
}
