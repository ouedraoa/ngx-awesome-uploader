import * as i0 from '@angular/core';
import { Injectable, Component, ChangeDetectionStrategy, EventEmitter, Input, Output, inject, Injector, runInInjectionContext, NgModule } from '@angular/core';
import { of, timer, Subject, bufferCount, switchMap, combineLatest } from 'rxjs';
import * as i1 from '@angular/platform-browser';
import { takeUntil, map, tap } from 'rxjs/operators';
import { lookup } from 'mrmime';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';

class FilePickerService {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    mockUploadFile(formData) {
        const event = new CustomEvent('customevent', {
            detail: {
                type: 'UploadProgreess'
            }
        });
        return of(event.detail);
    }
    // @ts-ignore: Not all code paths return a value
    createSafeUrl(file) {
        try {
            const url = window.URL.createObjectURL(file);
            const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            return safeUrl;
        }
        catch (er) {
            console.log(er);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePickerService, deps: [{ token: i1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePickerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePickerService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.DomSanitizer }] });

function GET_FILE_CATEGORY_TYPE(fileExtension) {
    if (fileExtension.includes('image')) {
        return 'image';
    }
    else if (fileExtension.includes('video')) {
        return 'video';
    }
    else {
        return 'other';
    }
}
function GET_FILE_TYPE(name) {
    return name.split('.').pop().toUpperCase();
}
function IS_IMAGE_FILE(fileType) {
    const IMAGE_TYPES = ['PNG', 'JPG', 'JPEG', 'BMP', 'WEBP', 'JFIF', 'TIFF'];
    return IMAGE_TYPES.includes(fileType.toUpperCase());
}

var FileValidationTypes;
(function (FileValidationTypes) {
    FileValidationTypes["fileMaxSize"] = "FILE_MAX_SIZE";
    FileValidationTypes["fileMaxCount"] = "FILE_MAX_COUNT";
    FileValidationTypes["totalMaxSize"] = "TOTAL_MAX_SIZE";
    FileValidationTypes["extensions"] = "EXTENSIONS";
    FileValidationTypes["uploadType"] = "UPLOAD_TYPE";
    FileValidationTypes["customValidator"] = "CUSTOM_VALIDATOR";
})(FileValidationTypes || (FileValidationTypes = {}));

const DefaultCaptions = {
    dropzone: {
        title: 'Drag and drop file here',
        or: 'or',
        browse: 'Browse Files'
    },
    cropper: {
        crop: 'Crop',
        cancel: 'Cancel'
    },
    previewCard: {
        remove: 'Remove',
        uploadError: 'Error on upload'
    }
};

const DEFAULT_CROPPER_OPTIONS = {
    dragMode: 'crop',
    aspectRatio: 1,
    autoCrop: true,
    movable: true,
    zoomable: true,
    scalable: true,
    autoCropArea: 0.8
};
function bitsToMB(size) {
    return parseFloat(size.toString()) / 1048576;
}

class FileValidatorService {
    constructor() { }
    /** Validates file extension */
    isValidExtension(fileName, fileExtensions) {
        if (!fileExtensions?.length) {
            return true;
        }
        const extension = fileName.split('.').pop();
        const fileExtensionsLowercase = fileExtensions.map(ext => ext.toLowerCase());
        if (fileExtensionsLowercase.indexOf(extension.toLowerCase()) === -1) {
            return false;
        }
        return true;
    }
    /** Validates if upload type is single so another file cannot be added */
    isValidUploadType(files, uploadType) {
        if (uploadType === 'single' && files?.length > 0) {
            return false;
        }
        else {
            return true;
        }
    }
    /** Validates max file count */
    isValidMaxFileCount(fileMaxCount, newFiles, files) {
        if (!fileMaxCount || fileMaxCount >= files?.length + newFiles?.length) {
            return true;
        }
        else {
            return false;
        }
    }
    isValidFileSize(size, fileMaxSize) {
        const fileMB = bitsToMB(size);
        if (!fileMaxSize || (fileMaxSize && fileMB < fileMaxSize)) {
            return true;
        }
        else {
            return false;
        }
    }
    isValidTotalFileSize(newFile, files, totalMaxSize) {
        /** Validating Total Files Size */
        const totalBits = files
            .map(f => f.file ? f.file.size : 0)
            .reduce((acc, curr) => acc + curr, 0);
        if (!totalMaxSize || (totalMaxSize && bitsToMB(totalBits + newFile.size) < totalMaxSize)) {
            return true;
        }
        else {
            return false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FileValidatorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FileValidatorService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FileValidatorService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });

/**
 * fileEntry is an instance of {@link FileSystemFileEntry} or {@link FileSystemDirectoryEntry}.
 * Which one is it can be checked using {@link FileSystemEntry.isFile} or {@link FileSystemEntry.isDirectory}
 * properties of the given {@link FileSystemEntry}.
 */
class UploadFile {
    constructor(relativePath, fileEntry) {
        this.relativePath = relativePath;
        this.fileEntry = fileEntry;
    }
}

class UploadEvent {
    constructor(files) {
        this.files = files;
    }
}

class CloudIconComponent {
    constructor() { }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: CloudIconComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.7", type: CloudIconComponent, isStandalone: false, selector: "cloud-icon", ngImport: i0, template: "    <!-- <div class=\"cloud-upload-icon\"><i></i></div> -->\n\n    <svg class=\"svg-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"42px\" height=\"42px\">\n        <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n        <path d=\"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z\"/>\n    </svg>", styles: [":host{display:flex;align-items:center;justify-content:center;margin-bottom:.4em}.svg-icon{fill:#95a5a6}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: CloudIconComponent, decorators: [{
            type: Component,
            args: [{ selector: 'cloud-icon', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "    <!-- <div class=\"cloud-upload-icon\"><i></i></div> -->\n\n    <svg class=\"svg-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"42px\" height=\"42px\">\n        <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n        <path d=\"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z\"/>\n    </svg>", styles: [":host{display:flex;align-items:center;justify-content:center;margin-bottom:.4em}.svg-icon{fill:#95a5a6}\n"] }]
        }], ctorParameters: () => [] });

class FileComponent {
    constructor(zone, renderer) {
        this.zone = zone;
        this.renderer = renderer;
        this.customstyle = null;
        this.disableIf = false;
        this.onFileDrop = new EventEmitter();
        this.onFileOver = new EventEmitter();
        this.onFileLeave = new EventEmitter();
        this.stack = [];
        this.files = [];
        this.dragoverflag = false;
        this.globalDisable = false;
        this.numOfActiveReadEntries = 0;
        if (!this.customstyle) {
            this.customstyle = 'drop-zone';
        }
        this.globalStart = this.renderer.listen('document', 'dragstart', evt => {
            this.globalDisable = true;
        });
        this.globalEnd = this.renderer.listen('document', 'dragend', evt => {
            this.globalDisable = false;
        });
    }
    onDragOver(event) {
        if (!this.globalDisable && !this.disableIf) {
            if (!this.dragoverflag) {
                this.dragoverflag = true;
                this.onFileOver.emit(event);
            }
            this.preventAndStop(event);
        }
    }
    onDragLeave(event) {
        if (!this.globalDisable && !this.disableIf) {
            if (this.dragoverflag) {
                this.dragoverflag = false;
                this.onFileLeave.emit(event);
            }
            this.preventAndStop(event);
        }
    }
    dropFiles(event) {
        if (!this.globalDisable && !this.disableIf) {
            this.dragoverflag = false;
            event.dataTransfer.dropEffect = 'copy';
            let length;
            if (event.dataTransfer.items) {
                length = event.dataTransfer.items.length;
            }
            else {
                length = event.dataTransfer.files.length;
            }
            for (let i = 0; i < length; i++) {
                let entry;
                if (event.dataTransfer.items) {
                    if (event.dataTransfer.items[i].webkitGetAsEntry) {
                        entry = event.dataTransfer.items[i].webkitGetAsEntry();
                    }
                }
                else {
                    if (event.dataTransfer.files[i].webkitGetAsEntry) {
                        entry = event.dataTransfer.files[i].webkitGetAsEntry();
                    }
                }
                if (!entry) {
                    const file = event.dataTransfer.files[i];
                    if (file) {
                        const fakeFileEntry = {
                            name: file.name,
                            isDirectory: false,
                            isFile: true,
                            file: (callback) => {
                                callback(file);
                            }
                        };
                        const toUpload = new UploadFile(fakeFileEntry.name, fakeFileEntry);
                        this.addToQueue(toUpload);
                    }
                }
                else {
                    if (entry.isFile) {
                        const toUpload = new UploadFile(entry.name, entry);
                        this.addToQueue(toUpload);
                    }
                    else if (entry.isDirectory) {
                        this.traverseFileTree(entry, entry.name);
                    }
                }
            }
            this.preventAndStop(event);
            const timerObservable = timer(200, 200);
            this.subscription = timerObservable.subscribe(t => {
                if (this.files.length > 0 && this.numOfActiveReadEntries === 0) {
                    this.onFileDrop.emit(new UploadEvent(this.files));
                    this.files = [];
                }
            });
        }
    }
    traverseFileTree(item, path) {
        if (item.isFile) {
            const toUpload = new UploadFile(path, item);
            this.files.push(toUpload);
            this.zone.run(() => {
                this.popToStack();
            });
        }
        else {
            this.pushToStack(path);
            path = path + '/';
            const dirReader = item.createReader();
            let entries = [];
            const thisObj = this;
            const readEntries = () => {
                thisObj.numOfActiveReadEntries++;
                dirReader.readEntries((res) => {
                    if (!res.length) {
                        // add empty folders
                        if (entries.length === 0) {
                            const toUpload = new UploadFile(path, item);
                            thisObj.zone.run(() => {
                                thisObj.addToQueue(toUpload);
                            });
                        }
                        else {
                            for (let i = 0; i < entries.length; i++) {
                                thisObj.zone.run(() => {
                                    thisObj.traverseFileTree(entries[i], path + entries[i].name);
                                });
                            }
                        }
                        thisObj.zone.run(() => {
                            thisObj.popToStack();
                        });
                    }
                    else {
                        // continue with the reading
                        entries = entries.concat(res);
                        readEntries();
                    }
                    thisObj.numOfActiveReadEntries--;
                });
            };
            readEntries();
        }
    }
    addToQueue(item) {
        this.files.push(item);
    }
    pushToStack(str) {
        this.stack.push(str);
    }
    popToStack() {
        const value = this.stack.pop();
    }
    clearQueue() {
        this.files = [];
    }
    preventAndStop(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.globalStart();
        this.globalEnd();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FileComponent, deps: [{ token: i0.NgZone }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.7", type: FileComponent, isStandalone: false, selector: "file-drop", inputs: { captions: "captions", customstyle: "customstyle", disableIf: "disableIf" }, outputs: { onFileDrop: "onFileDrop", onFileOver: "onFileOver", onFileLeave: "onFileLeave" }, ngImport: i0, template: "<div id=\"dropZone\"  [className]=\"customstyle\" [class.over]=\"dragoverflag\"\n    (drop)=\"dropFiles($event)\"\n    (dragover)=\"onDragOver($event)\" (dragleave)=\"onDragLeave($event)\">\n\n    <div #ref class=\"custom-dropzone\" >\n      <ng-content></ng-content>\n      </div>\n\n    <div class=\"content\" *ngIf=\"ref.children?.length == 0\">\n             <cloud-icon class=\"cloud-icon\"></cloud-icon>\n              <div class=\"content-top-text\">\n                {{captions?.dropzone?.title}}\n              </div>\n              <div class=\"content-center-text\">\n                {{captions?.dropzone?.or}}\n              </div>\n              <button class=\"file-browse-button\" type=\"button\">\n                {{captions?.dropzone?.browse}}\n              </button>\n    </div>\n</div>\n", styles: [":host{display:block;width:100%;padding:0 16px}#dropZone{max-width:440px;margin:auto;border:2px dashed #ecf0f1;border-radius:6px;padding:56px 0;background:#fff}.file-browse-button{padding:12px 18px;background:#7f8c8d;border:0;outline:0;font-size:14px;color:#fff;font-weight:700;border-radius:6px;cursor:pointer}.content{display:flex;flex-direction:column;justify-content:center;align-items:center}.over{background-color:#93939380}.content-top-text{font-size:18px;font-weight:700;color:#5b5b7b}.content-center-text{color:#90a0bc;margin:12px 0;font-size:14px}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: CloudIconComponent, selector: "cloud-icon" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FileComponent, decorators: [{
            type: Component,
            args: [{ selector: 'file-drop', standalone: false, template: "<div id=\"dropZone\"  [className]=\"customstyle\" [class.over]=\"dragoverflag\"\n    (drop)=\"dropFiles($event)\"\n    (dragover)=\"onDragOver($event)\" (dragleave)=\"onDragLeave($event)\">\n\n    <div #ref class=\"custom-dropzone\" >\n      <ng-content></ng-content>\n      </div>\n\n    <div class=\"content\" *ngIf=\"ref.children?.length == 0\">\n             <cloud-icon class=\"cloud-icon\"></cloud-icon>\n              <div class=\"content-top-text\">\n                {{captions?.dropzone?.title}}\n              </div>\n              <div class=\"content-center-text\">\n                {{captions?.dropzone?.or}}\n              </div>\n              <button class=\"file-browse-button\" type=\"button\">\n                {{captions?.dropzone?.browse}}\n              </button>\n    </div>\n</div>\n", styles: [":host{display:block;width:100%;padding:0 16px}#dropZone{max-width:440px;margin:auto;border:2px dashed #ecf0f1;border-radius:6px;padding:56px 0;background:#fff}.file-browse-button{padding:12px 18px;background:#7f8c8d;border:0;outline:0;font-size:14px;color:#fff;font-weight:700;border-radius:6px;cursor:pointer}.content{display:flex;flex-direction:column;justify-content:center;align-items:center}.over{background-color:#93939380}.content-top-text{font-size:18px;font-weight:700;color:#5b5b7b}.content-center-text{color:#90a0bc;margin:12px 0;font-size:14px}\n"] }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.Renderer2 }], propDecorators: { captions: [{
                type: Input
            }], customstyle: [{
                type: Input
            }], disableIf: [{
                type: Input
            }], onFileDrop: [{
                type: Output
            }], onFileOver: [{
                type: Output
            }], onFileLeave: [{
                type: Output
            }] } });

var UploadStatus;
(function (UploadStatus) {
    UploadStatus["UPLOADED"] = "UPLOADED";
    UploadStatus["IN_PROGRESS"] = "IN PROGRESS";
    UploadStatus["ERROR"] = "ERROR";
})(UploadStatus || (UploadStatus = {}));
class FilePickerAdapter {
}

class RefreshIconComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: RefreshIconComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.7", type: RefreshIconComponent, isStandalone: false, selector: "refresh-icon", ngImport: i0, template: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"18px\" height=\"18px\">\n    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n    <path d=\"M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z\"/>\n</svg>", styles: [":host{display:block;cursor:pointer}svg{fill:#95a5a6}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: RefreshIconComponent, decorators: [{
            type: Component,
            args: [{ selector: 'refresh-icon', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"18px\" height=\"18px\">\n    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n    <path d=\"M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z\"/>\n</svg>", styles: [":host{display:block;cursor:pointer}svg{fill:#95a5a6}\n"] }]
        }] });

class CloseIconComponent {
    constructor() { }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: CloseIconComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.7", type: CloseIconComponent, isStandalone: false, selector: "close-icon", ngImport: i0, template: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"\n width=\"18px\" height=\"18px\">\n <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n <path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/>\n</svg>", styles: [":host{display:block;cursor:pointer}svg{fill:#95a5a6}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: CloseIconComponent, decorators: [{
            type: Component,
            args: [{ selector: 'close-icon', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"\n width=\"18px\" height=\"18px\">\n <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n <path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/>\n</svg>", styles: [":host{display:block;cursor:pointer}svg{fill:#95a5a6}\n"] }]
        }], ctorParameters: () => [] });

class FilePreviewItemComponent {
    constructor(fileService, changeRef) {
        this.fileService = fileService;
        this.changeRef = changeRef;
        this.removeFile = new EventEmitter();
        this.uploadSuccess = new EventEmitter();
        this.uploadFail = new EventEmitter();
        this.imageClicked = new EventEmitter();
    }
    ngOnInit() {
        if (this.fileItem.file) {
            this._uploadFile(this.fileItem);
            this.safeUrl = this.getSafeUrl(this.fileItem.file);
        }
        this.fileType = GET_FILE_TYPE(this.fileItem.fileName);
        this.isImageFile = IS_IMAGE_FILE(this.fileType);
    }
    getSafeUrl(file) {
        return this.fileService.createSafeUrl(file);
    }
    /** Converts bytes to nice size */
    niceBytes(x) {
        const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let l = 0;
        let n = parseInt(x, 10) || 0;
        while (n >= 1024 && ++l) {
            n = n / 1024;
        }
        // include a decimal point and a tenths-place digit if presenting
        // less than ten of KB or greater units
        return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
    }
    /** Retry file upload when upload was unsuccessfull */
    onRetry() {
        this.uploadError = undefined;
        this._uploadFile(this.fileItem);
    }
    onRemove(fileItem) {
        this._uploadUnsubscribe();
        this.removeFile.next({
            ...fileItem,
            uploadResponse: this.uploadResponse || fileItem.uploadResponse
        });
    }
    _uploadFile(fileItem) {
        if (!this.enableAutoUpload) {
            return;
        }
        if (this.adapter) {
            this._uploadSubscription =
                this.adapter.uploadFile(fileItem)
                    .subscribe((res) => {
                    if (res && res.status === UploadStatus.UPLOADED) {
                        this._onUploadSuccess(res.body, fileItem);
                        this.uploadProgress = undefined;
                    }
                    if (res && res.status === UploadStatus.IN_PROGRESS) {
                        this.uploadProgress = res.progress;
                        this.changeRef.detectChanges();
                    }
                    if (res && res.status === UploadStatus.ERROR) {
                        this.uploadError = true;
                        this.uploadFail.next(res.body);
                        this.uploadProgress = undefined;
                    }
                    this.changeRef.detectChanges();
                }, (er) => {
                    this.uploadError = true;
                    this.uploadFail.next(er);
                    this.uploadProgress = undefined;
                    this.changeRef.detectChanges();
                });
        }
        else {
            console.warn('no adapter was provided');
        }
    }
    /** Emits event when file upload api returns success  */
    _onUploadSuccess(uploadResponse, fileItem) {
        this.uploadResponse = uploadResponse;
        this.fileItem.uploadResponse = uploadResponse;
        this.uploadSuccess.next({ ...fileItem, uploadResponse });
    }
    /** Cancel upload. Cancels request  */
    _uploadUnsubscribe() {
        if (this._uploadSubscription) {
            this._uploadSubscription.unsubscribe();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePreviewItemComponent, deps: [{ token: FilePickerService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.7", type: FilePreviewItemComponent, isStandalone: false, selector: "file-preview-item", inputs: { fileItem: "fileItem", adapter: "adapter", itemTemplate: "itemTemplate", captions: "captions", enableAutoUpload: "enableAutoUpload" }, outputs: { removeFile: "removeFile", uploadSuccess: "uploadSuccess", uploadFail: "uploadFail", imageClicked: "imageClicked" }, ngImport: i0, template: "    <div class=\"file-preview-wrapper\" *ngIf=\"fileItem\" [ngClass] = \"{'visually-hidden': itemTemplate}\">\n\n\n        <div class=\"file-preview-thumbnail\">\n          <div class=\"img-preview-thumbnail\" *ngIf=\"isImageFile && fileItem?.file\" >\n            <img [src]=\"safeUrl\" (click)=\"imageClicked.next(fileItem)\">\n          </div>\n          <div class=\"other-preview-thumbnail\"\n            *ngIf=\"!isImageFile || !fileItem?.file\"\n            [ngClass]=\"fileItem.fileName.split('.').pop()\"\n            >\n            {{fileType}}\n          </div>\n          <div class=\"thumbnail-backdrop\">\n\n          </div>\n        </div>\n        <div class=\"file-preview-description\" >\n          <a class=\"file-preview-title\" [title]=\"fileItem.fileName\" href=\"javascript:void(0)\"><p>{{fileItem.fileName}}</p></a>\n          <div class=\"file-preview-size\" *ngIf=\"fileItem?.file\">{{niceBytes(fileItem.file?.size)}}</div>\n        </div>\n        <div class=\"file-preview-actions\" >\n            <div class=\"ngx-checkmark-wrapper\" *ngIf=\"!uploadError && !uploadProgress && fileItem?.file\">\n              <span class=\"ngx-checkmark\"></span>\n            </div>\n            <refresh-icon *ngIf=\"uploadError\" (click)=\"onRetry()\"></refresh-icon>\n            <a class=\"ngx-close-icon-wrapper\"\n            (click)=\"onRemove(fileItem)\"\n             title=\"{{captions?.previewCard?.remove}}\"\n             >\n              <close-icon class=\"ngx-close-icon\"></close-icon>\n            </a>\n        </div>\n          <a class=\"file-upload-error-wrapper\" *ngIf=\"uploadError && !uploadProgress\" href=\"javascipt:void(0)\"\n          title=\"{{captions?.previewCard?.uploadError}}\">\n          </a>\n\n        <ng-container *ngIf=\"uploadProgress\">\n        <div class=\"file-upload-progress-bar-wrapper\"  >\n          <div class=\"file-upload-progress-bar\"  [ngStyle]=\"{ 'width': uploadProgress + '%' }\">\n          </div>\n        </div>\n\n        <div class=\"file-upload-percentage-wrapper\" >\n          <div class=\"file-upload-percentage\">{{uploadProgress}} %</div>\n          </div>\n        </ng-container>\n\n      </div>\n\n<ng-container *ngTemplateOutlet=\"itemTemplate;context: {fileItem: fileItem, uploadProgress: uploadProgress}\" > </ng-container>\n", styles: [":host{display:block;padding:20px 16px;border-bottom:1px solid #ebeef1;max-width:440px;position:relative}.visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;outline:0;-webkit-appearance:none;-moz-appearance:none}.file-preview-wrapper{display:flex;width:100%}.file-preview-wrapper .file-preview-thumbnail{position:relative;z-index:2;cursor:pointer}.file-preview-wrapper .file-preview-thumbnail .img-preview-thumbnail{width:36px;height:36px}.file-preview-wrapper .file-preview-thumbnail .img-preview-thumbnail img{width:100%;height:100%;object-fit:cover;border-radius:6px}.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail{width:36px;height:36px;display:flex;justify-content:center;align-items:center;background:#706fd3;border-radius:4px;color:#fff;font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden}.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.pdf{background:#e4394e}.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.doc,.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.docx{background:#2196f3}.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.xls,.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.xlsx{background:#4caf50}.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.txt,.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.ppt{background:#ff9800}.file-preview-wrapper .file-preview-thumbnail .thumbnail-backdrop{visibility:hidden;position:absolute;left:0;top:0;width:100%;height:100%;border-radius:6px;transition:all .1s ease-in-out;pointer-events:none;background:#2b384733}.file-preview-wrapper .file-preview-thumbnail:hover .thumbnail-backdrop{visibility:visible}.file-preview-wrapper .file-preview-thumbnail:active .thumbnail-backdrop{visibility:visible;background:#2b384766}.file-preview-wrapper .file-preview-description{display:flex;flex-direction:column;align-items:flex-start;padding-left:16px;padding-right:16px;color:#74809d;overflow:hidden;flex:1;z-index:2;position:relative}.file-preview-wrapper .file-preview-description .file-preview-title{font-weight:700;width:90%;text-decoration:none;color:#74809d;cursor:default}.file-preview-wrapper .file-preview-description .file-preview-title p{text-overflow:ellipsis;max-width:100%;overflow:hidden;white-space:nowrap;margin:0}.file-preview-wrapper .file-preview-description .file-preview-size{font-size:12px;color:#979fb8}.file-preview-wrapper .file-preview-actions{display:flex;align-items:center;font-size:10px;z-index:3;position:relative}.file-preview-wrapper .file-preview-actions .ngx-checkmark-wrapper{position:relative;cursor:pointer;font-size:22px;height:20px;width:20px;border-radius:50%;background:#43d084}.file-preview-wrapper .file-preview-actions .ngx-checkmark-wrapper .ngx-checkmark{position:absolute;top:0;left:0;height:19px;width:19px}.file-preview-wrapper .file-preview-actions .ngx-checkmark-wrapper .ngx-checkmark:after{content:\"\";position:absolute;display:block;left:7px;top:4px;width:3px;height:7px;border:1px solid #ffffff;border-width:0 3px 3px 0;-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.file-preview-wrapper .file-preview-actions .ngx-close-icon-wrapper{border-radius:50%;padding:3px;margin-left:5px;cursor:pointer}.file-preview-wrapper .file-upload-progress-bar-wrapper,.file-preview-wrapper .file-upload-percentage-wrapper{position:absolute;z-index:1;width:100%;height:95%;left:0;top:0;bottom:0;margin:auto}.file-preview-wrapper .file-upload-progress-bar{background:#eef1fa;border-radius:6px;width:0%;height:95%;transition:width .3s ease-in}.file-preview-wrapper .file-upload-percentage{padding-right:10%;color:#c2cdda;padding-top:5%;font-size:19px;text-align:right}.file-preview-wrapper .file-upload-error-wrapper{position:absolute;z-index:1;width:100%;height:95%;left:0;top:0;bottom:0;margin:auto;background:#fe546f0f}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: RefreshIconComponent, selector: "refresh-icon" }, { kind: "component", type: CloseIconComponent, selector: "close-icon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePreviewItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'file-preview-item', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "    <div class=\"file-preview-wrapper\" *ngIf=\"fileItem\" [ngClass] = \"{'visually-hidden': itemTemplate}\">\n\n\n        <div class=\"file-preview-thumbnail\">\n          <div class=\"img-preview-thumbnail\" *ngIf=\"isImageFile && fileItem?.file\" >\n            <img [src]=\"safeUrl\" (click)=\"imageClicked.next(fileItem)\">\n          </div>\n          <div class=\"other-preview-thumbnail\"\n            *ngIf=\"!isImageFile || !fileItem?.file\"\n            [ngClass]=\"fileItem.fileName.split('.').pop()\"\n            >\n            {{fileType}}\n          </div>\n          <div class=\"thumbnail-backdrop\">\n\n          </div>\n        </div>\n        <div class=\"file-preview-description\" >\n          <a class=\"file-preview-title\" [title]=\"fileItem.fileName\" href=\"javascript:void(0)\"><p>{{fileItem.fileName}}</p></a>\n          <div class=\"file-preview-size\" *ngIf=\"fileItem?.file\">{{niceBytes(fileItem.file?.size)}}</div>\n        </div>\n        <div class=\"file-preview-actions\" >\n            <div class=\"ngx-checkmark-wrapper\" *ngIf=\"!uploadError && !uploadProgress && fileItem?.file\">\n              <span class=\"ngx-checkmark\"></span>\n            </div>\n            <refresh-icon *ngIf=\"uploadError\" (click)=\"onRetry()\"></refresh-icon>\n            <a class=\"ngx-close-icon-wrapper\"\n            (click)=\"onRemove(fileItem)\"\n             title=\"{{captions?.previewCard?.remove}}\"\n             >\n              <close-icon class=\"ngx-close-icon\"></close-icon>\n            </a>\n        </div>\n          <a class=\"file-upload-error-wrapper\" *ngIf=\"uploadError && !uploadProgress\" href=\"javascipt:void(0)\"\n          title=\"{{captions?.previewCard?.uploadError}}\">\n          </a>\n\n        <ng-container *ngIf=\"uploadProgress\">\n        <div class=\"file-upload-progress-bar-wrapper\"  >\n          <div class=\"file-upload-progress-bar\"  [ngStyle]=\"{ 'width': uploadProgress + '%' }\">\n          </div>\n        </div>\n\n        <div class=\"file-upload-percentage-wrapper\" >\n          <div class=\"file-upload-percentage\">{{uploadProgress}} %</div>\n          </div>\n        </ng-container>\n\n      </div>\n\n<ng-container *ngTemplateOutlet=\"itemTemplate;context: {fileItem: fileItem, uploadProgress: uploadProgress}\" > </ng-container>\n", styles: [":host{display:block;padding:20px 16px;border-bottom:1px solid #ebeef1;max-width:440px;position:relative}.visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;outline:0;-webkit-appearance:none;-moz-appearance:none}.file-preview-wrapper{display:flex;width:100%}.file-preview-wrapper .file-preview-thumbnail{position:relative;z-index:2;cursor:pointer}.file-preview-wrapper .file-preview-thumbnail .img-preview-thumbnail{width:36px;height:36px}.file-preview-wrapper .file-preview-thumbnail .img-preview-thumbnail img{width:100%;height:100%;object-fit:cover;border-radius:6px}.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail{width:36px;height:36px;display:flex;justify-content:center;align-items:center;background:#706fd3;border-radius:4px;color:#fff;font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden}.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.pdf{background:#e4394e}.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.doc,.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.docx{background:#2196f3}.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.xls,.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.xlsx{background:#4caf50}.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.txt,.file-preview-wrapper .file-preview-thumbnail .other-preview-thumbnail.ppt{background:#ff9800}.file-preview-wrapper .file-preview-thumbnail .thumbnail-backdrop{visibility:hidden;position:absolute;left:0;top:0;width:100%;height:100%;border-radius:6px;transition:all .1s ease-in-out;pointer-events:none;background:#2b384733}.file-preview-wrapper .file-preview-thumbnail:hover .thumbnail-backdrop{visibility:visible}.file-preview-wrapper .file-preview-thumbnail:active .thumbnail-backdrop{visibility:visible;background:#2b384766}.file-preview-wrapper .file-preview-description{display:flex;flex-direction:column;align-items:flex-start;padding-left:16px;padding-right:16px;color:#74809d;overflow:hidden;flex:1;z-index:2;position:relative}.file-preview-wrapper .file-preview-description .file-preview-title{font-weight:700;width:90%;text-decoration:none;color:#74809d;cursor:default}.file-preview-wrapper .file-preview-description .file-preview-title p{text-overflow:ellipsis;max-width:100%;overflow:hidden;white-space:nowrap;margin:0}.file-preview-wrapper .file-preview-description .file-preview-size{font-size:12px;color:#979fb8}.file-preview-wrapper .file-preview-actions{display:flex;align-items:center;font-size:10px;z-index:3;position:relative}.file-preview-wrapper .file-preview-actions .ngx-checkmark-wrapper{position:relative;cursor:pointer;font-size:22px;height:20px;width:20px;border-radius:50%;background:#43d084}.file-preview-wrapper .file-preview-actions .ngx-checkmark-wrapper .ngx-checkmark{position:absolute;top:0;left:0;height:19px;width:19px}.file-preview-wrapper .file-preview-actions .ngx-checkmark-wrapper .ngx-checkmark:after{content:\"\";position:absolute;display:block;left:7px;top:4px;width:3px;height:7px;border:1px solid #ffffff;border-width:0 3px 3px 0;-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.file-preview-wrapper .file-preview-actions .ngx-close-icon-wrapper{border-radius:50%;padding:3px;margin-left:5px;cursor:pointer}.file-preview-wrapper .file-upload-progress-bar-wrapper,.file-preview-wrapper .file-upload-percentage-wrapper{position:absolute;z-index:1;width:100%;height:95%;left:0;top:0;bottom:0;margin:auto}.file-preview-wrapper .file-upload-progress-bar{background:#eef1fa;border-radius:6px;width:0%;height:95%;transition:width .3s ease-in}.file-preview-wrapper .file-upload-percentage{padding-right:10%;color:#c2cdda;padding-top:5%;font-size:19px;text-align:right}.file-preview-wrapper .file-upload-error-wrapper{position:absolute;z-index:1;width:100%;height:95%;left:0;top:0;bottom:0;margin:auto;background:#fe546f0f}\n"] }]
        }], ctorParameters: () => [{ type: FilePickerService }, { type: i0.ChangeDetectorRef }], propDecorators: { removeFile: [{
                type: Output
            }], uploadSuccess: [{
                type: Output
            }], uploadFail: [{
                type: Output
            }], imageClicked: [{
                type: Output
            }], fileItem: [{
                type: Input
            }], adapter: [{
                type: Input
            }], itemTemplate: [{
                type: Input
            }], captions: [{
                type: Input
            }], enableAutoUpload: [{
                type: Input
            }] } });

class PreviewLightboxComponent {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
        this.previewClose = new EventEmitter();
    }
    ngOnInit() {
        this.getSafeUrl(this.file.file);
    }
    getSafeUrl(file) {
        const url = window.URL.createObjectURL(file);
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    onClose(event) {
        this.previewClose.next();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: PreviewLightboxComponent, deps: [{ token: i1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.7", type: PreviewLightboxComponent, isStandalone: false, selector: "preview-lightbox", inputs: { file: "file" }, outputs: { previewClose: "previewClose" }, ngImport: i0, template: "<div class=\"ng-modal-backdrop\" (click)=\"onClose($event)\">\n\n</div>\n\n<div class=\"ng-modal-content\" >\n  <div class=\"close-icon-wrapper\" (click)=\"onClose($event)\">\n      <close-icon></close-icon>\n  </div>\n  <div class=\"lightbox-item\" >\n    <img [src]=\"safeUrl\" (load)=\"loaded = true\" [ngStyle]=\"{'visibility': loaded ? 'visible' : 'hidden'}\">\n  </div>\n </div>\n", styles: [":host{display:flex;flex-direction:column;justify-content:center;align-items:center;position:fixed;z-index:1040;left:0;top:0;width:100vw;height:100vh;overflow:auto;overflow:hidden}.ng-modal-backdrop{position:fixed;inset:0;z-index:1040;background:#00000049}.ng-modal-content{display:flex;justify-content:center;align-items:center;color:#000000de;z-index:1041}.ng-modal-content .close-icon-wrapper{position:absolute;top:20px;right:20px;font-size:20px}.ng-modal-content .lightbox-item img{max-width:calc(100vw - 30px);max-height:calc(100vh - 30px);width:100%;height:auto;object-fit:contain;animation-name:zoomIn;animation-duration:.2s}@keyframes zoomIn{0%{opacity:0;transform:scale3d(.9,.9,.9)}50%{opacity:1}}\n"], dependencies: [{ kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: CloseIconComponent, selector: "close-icon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: PreviewLightboxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'preview-lightbox', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<div class=\"ng-modal-backdrop\" (click)=\"onClose($event)\">\n\n</div>\n\n<div class=\"ng-modal-content\" >\n  <div class=\"close-icon-wrapper\" (click)=\"onClose($event)\">\n      <close-icon></close-icon>\n  </div>\n  <div class=\"lightbox-item\" >\n    <img [src]=\"safeUrl\" (load)=\"loaded = true\" [ngStyle]=\"{'visibility': loaded ? 'visible' : 'hidden'}\">\n  </div>\n </div>\n", styles: [":host{display:flex;flex-direction:column;justify-content:center;align-items:center;position:fixed;z-index:1040;left:0;top:0;width:100vw;height:100vh;overflow:auto;overflow:hidden}.ng-modal-backdrop{position:fixed;inset:0;z-index:1040;background:#00000049}.ng-modal-content{display:flex;justify-content:center;align-items:center;color:#000000de;z-index:1041}.ng-modal-content .close-icon-wrapper{position:absolute;top:20px;right:20px;font-size:20px}.ng-modal-content .lightbox-item img{max-width:calc(100vw - 30px);max-height:calc(100vh - 30px);width:100%;height:auto;object-fit:contain;animation-name:zoomIn;animation-duration:.2s}@keyframes zoomIn{0%{opacity:0;transform:scale3d(.9,.9,.9)}50%{opacity:1}}\n"] }]
        }], ctorParameters: () => [{ type: i1.DomSanitizer }], propDecorators: { file: [{
                type: Input
            }], previewClose: [{
                type: Output
            }] } });

class FilePreviewContainerComponent {
    constructor() {
        this.removeFile = new EventEmitter();
        this.uploadSuccess = new EventEmitter();
        this.uploadFail = new EventEmitter();
    }
    ngOnInit() {
    }
    openLightbox(file) {
        this.lightboxFile = file;
    }
    closeLightbox() {
        this.lightboxFile = undefined;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePreviewContainerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.7", type: FilePreviewContainerComponent, isStandalone: false, selector: "file-preview-container", inputs: { previewFiles: "previewFiles", itemTemplate: "itemTemplate", enableAutoUpload: "enableAutoUpload", adapter: "adapter", captions: "captions" }, outputs: { removeFile: "removeFile", uploadSuccess: "uploadSuccess", uploadFail: "uploadFail" }, ngImport: i0, template: "<preview-lightbox *ngIf=\"lightboxFile\" [file]=\"lightboxFile\" (previewClose)=\"closeLightbox()\"></preview-lightbox>\n<file-preview-item\n    *ngFor=\"let file of previewFiles\"\n    [fileItem]=\"file\"\n    (removeFile)=\"removeFile.next($event)\"\n    (uploadSuccess)=\"uploadSuccess.next($event)\"\n    (uploadFail)=\"uploadFail.next($event)\"\n    (imageClicked)=\"openLightbox($event)\"\n    [itemTemplate]=\"itemTemplate\"\n    [adapter]=\"adapter\"\n    [captions]=\"captions\"\n    [enableAutoUpload]=\"enableAutoUpload\"\n></file-preview-item>\n", styles: [":host{display:flex;flex-direction:column;justify-content:flex-start;width:100%;background:#fafbfd}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: FilePreviewItemComponent, selector: "file-preview-item", inputs: ["fileItem", "adapter", "itemTemplate", "captions", "enableAutoUpload"], outputs: ["removeFile", "uploadSuccess", "uploadFail", "imageClicked"] }, { kind: "component", type: PreviewLightboxComponent, selector: "preview-lightbox", inputs: ["file"], outputs: ["previewClose"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePreviewContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'file-preview-container', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<preview-lightbox *ngIf=\"lightboxFile\" [file]=\"lightboxFile\" (previewClose)=\"closeLightbox()\"></preview-lightbox>\n<file-preview-item\n    *ngFor=\"let file of previewFiles\"\n    [fileItem]=\"file\"\n    (removeFile)=\"removeFile.next($event)\"\n    (uploadSuccess)=\"uploadSuccess.next($event)\"\n    (uploadFail)=\"uploadFail.next($event)\"\n    (imageClicked)=\"openLightbox($event)\"\n    [itemTemplate]=\"itemTemplate\"\n    [adapter]=\"adapter\"\n    [captions]=\"captions\"\n    [enableAutoUpload]=\"enableAutoUpload\"\n></file-preview-item>\n", styles: [":host{display:flex;flex-direction:column;justify-content:flex-start;width:100%;background:#fafbfd}\n"] }]
        }], ctorParameters: () => [], propDecorators: { previewFiles: [{
                type: Input
            }], itemTemplate: [{
                type: Input
            }], enableAutoUpload: [{
                type: Input
            }], removeFile: [{
                type: Output
            }], uploadSuccess: [{
                type: Output
            }], uploadFail: [{
                type: Output
            }], adapter: [{
                type: Input
            }], captions: [{
                type: Input
            }] } });

class FilePickerComponent {
    constructor(fileService, fileValidatorService, changeRef) {
        this.fileService = fileService;
        this.fileValidatorService = fileValidatorService;
        this.changeRef = changeRef;
        /** Emitted when file upload via api successfully. Emitted for every file */
        this.uploadSuccess = new EventEmitter();
        /** Emitted when file upload via api failed. Emitted for every file */
        this.uploadFail = new EventEmitter();
        /** Emitted when file is removed via api successfully. Emitted for every file */
        this.removeSuccess = new EventEmitter();
        /** Emitted on file validation fail */
        this.validationError = new EventEmitter();
        /** Emitted when file is added and passed validations. Not uploaded yet */
        this.fileAdded = new EventEmitter();
        /** Emitted when file is removed from fileList */
        this.fileRemoved = new EventEmitter();
        /** Whether to enable cropper. Default: disabled */
        this.enableCropper = false;
        /** Whether to show default drag and drop zone. Default:true */
        this.showeDragDropZone = true;
        /** Whether to show default files preview container. Default: true */
        this.showPreviewContainer = true;
        /** Single or multiple. Default: multi */
        this.uploadType = 'multi';
        /** Cropped canvas options. */
        this.croppedCanvasOptions = {};
        /** Custom captions input. Used for multi language support */
        this.captions = DefaultCaptions;
        /** captions object */
        /** Whether to auto upload file on file choose or not. Default: true */
        this.enableAutoUpload = true;
        this.files = [];
        /** Files array for cropper. Will be shown equentially if crop enabled */
        this.filesForCropper = [];
        this._cropClosed$ = new Subject();
        this._onDestroy$ = new Subject();
        this.injector = inject(Injector);
    }
    ngOnInit() {
        this._setCropperOptions();
        this._listenToCropClose();
    }
    ngOnDestroy() {
        this._onDestroy$.next();
        this._onDestroy$.complete();
    }
    /** On input file selected */
    // TODO: fix any
    onChange(event) {
        const files = Array.from(event);
        this.handleFiles(files).subscribe();
    }
    /** On file dropped */
    dropped(event) {
        const files = event.files;
        const filesForUpload = new Subject();
        let droppedFilesCount = 0;
        for (const droppedFile of files) {
            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                droppedFilesCount += 1;
                const fileEntry = droppedFile.fileEntry;
                fileEntry.file((file) => {
                    filesForUpload.next(file);
                });
            }
            else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry;
                // console.log(droppedFile.relativePath, fileEntry);
            }
        }
        runInInjectionContext((this.injector), () => {
            filesForUpload.pipe(takeUntilDestroyed(), bufferCount(droppedFilesCount), switchMap(filesForUpload => this.handleFiles(filesForUpload))).subscribe();
        });
    }
    /** Emits event when file upload api returns success  */
    onUploadSuccess(fileItem) {
        this.uploadSuccess.next(fileItem);
    }
    /** Emits event when file upload api returns success  */
    onUploadFail(er) {
        this.uploadFail.next(er);
    }
    /** Emits event when file remove api returns success  */
    onRemoveSuccess(fileItem) {
        this.removeSuccess.next(fileItem);
        this.removeFileFromList(fileItem);
    }
    getSafeUrl(file) {
        return this.fileService.createSafeUrl(file);
    }
    /** Removes file from UI and sends api */
    removeFile(fileItem) {
        if (!this.enableAutoUpload) {
            this.removeFileFromList(fileItem);
            return;
        }
        if (this.adapter) {
            this.adapter.removeFile(fileItem).subscribe(res => {
                this.onRemoveSuccess(fileItem);
            });
        }
        else {
            console.warn('no adapter was provided');
        }
    }
    /** Listen when Cropper is closed and open new cropper if next image exists */
    _listenToCropClose() {
        this._cropClosed$
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((res) => {
            const croppedIndex = this.filesForCropper.findIndex(item => item.name === res.fileName);
            const nextFile = croppedIndex !== -1
                ? this.filesForCropper[croppedIndex + 1]
                : undefined;
            this.filesForCropper = [...this.filesForCropper].filter(item => item.name !== res.fileName);
            if (nextFile) {
                this.openCropper(nextFile);
            }
        });
    }
    /** Sets custom cropper options if avaiable */
    _setCropperOptions() {
        if (!this.cropperOptions) {
            this._setDefaultCropperOptions();
        }
    }
    /** Sets manual cropper options if no custom options are avaiable */
    _setDefaultCropperOptions() {
        this.cropperOptions = DEFAULT_CROPPER_OPTIONS;
    }
    /** Handles input and drag/drop files */
    handleFiles(files) {
        if (!this.isValidMaxFileCount(files)) {
            return of(null);
        }
        const isValidUploadSync = files.every(item => this._validateFileSync(item));
        const asyncFunctions = files.map(item => this._validateFileAsync(item));
        return combineLatest([...asyncFunctions]).pipe(map(res => {
            const isValidUploadAsync = res.every(result => result === true);
            if (!isValidUploadSync || !isValidUploadAsync) {
                return;
            }
            files.forEach((file, index) => {
                this.handleInputFile(file, index);
            });
        }));
    }
    /** Validates synchronous validations */
    _validateFileSync(file) {
        if (!file) {
            return false;
        }
        if (!this.isValidUploadType(file)) {
            return false;
        }
        if (!this.isValidExtension(file, file.name)) {
            return false;
        }
        return true;
    }
    /** Validates asynchronous validations */
    _validateFileAsync(file) {
        if (!this.customValidator) {
            return of(true);
        }
        return this.customValidator(file).pipe(tap(res => {
            if (!res) {
                this.validationError.next({
                    file,
                    error: FileValidationTypes.customValidator
                });
            }
        }));
    }
    /** Handles input and drag&drop files */
    handleInputFile(file, index) {
        const type = GET_FILE_CATEGORY_TYPE(file.type);
        if (type === 'image' && this.enableCropper) {
            this.filesForCropper.push(file);
            if (!this.currentCropperFile) {
                this.openCropper(file);
            }
        }
        else {
            /** Size is not initially checked on handleInputFiles because of cropper size change */
            if (this.isValidSize(file, file.size)) {
                this.pushFile(file);
            }
        }
    }
    /** Validates if upload type is single so another file cannot be added */
    isValidUploadType(file) {
        const isValid = this.fileValidatorService.isValidUploadType(this.files, this.uploadType);
        if (!isValid) {
            this.validationError.next({
                file,
                error: FileValidationTypes.uploadType
            });
            return false;
        }
        ;
        return true;
    }
    /** Validates max file count */
    isValidMaxFileCount(files) {
        const isValid = this.fileValidatorService.isValidMaxFileCount(this.fileMaxCount, files, this.files);
        if (isValid) {
            return true;
        }
        else {
            this.validationError.next({
                file: null,
                error: FileValidationTypes.fileMaxCount
            });
            return false;
        }
    }
    /** Add file to file list after succesfull validation */
    pushFile(file, fileName = file.name) {
        const newFile = { file, fileName };
        const files = [...this.files, newFile];
        this.setFiles(files);
        this.fileAdded.next({ file, fileName });
        this.changeRef.detectChanges();
    }
    /** @description Set files for uploader */
    setFiles(files) {
        this.files = files;
        this.changeRef.detectChanges();
    }
    /** Opens cropper for image crop */
    openCropper(file) {
        if (window.CROPPER || typeof Cropper !== 'undefined') {
            this.safeCropImgUrl = this.fileService.createSafeUrl(file);
            this.currentCropperFile = file;
            this.changeRef.detectChanges();
        }
        else {
            console.warn("please import cropperjs script and styles to use cropper feature or disable it by setting [enableCropper]='false'");
            return;
        }
    }
    /** On img load event */
    cropperImgLoaded(e) {
        const image = document.getElementById('cropper-img');
        this.cropper = new Cropper(image, this.cropperOptions);
    }
    /** Close or cancel cropper */
    closeCropper(filePreview) {
        this.currentCropperFile = undefined;
        this.cropper = undefined;
        this.changeRef.detectChanges();
        setTimeout(() => this._cropClosed$.next(filePreview), 200);
    }
    /** Removes files from files list */
    removeFileFromList(file) {
        const files = this.files.filter(f => f.fileName !== file.fileName);
        this.setFiles(files);
        this.fileRemoved.next(file);
        this.changeRef.detectChanges();
    }
    /** Validates file extension */
    isValidExtension(file, fileName) {
        const isValid = this.fileValidatorService.isValidExtension(fileName, this.fileExtensions);
        if (!isValid) {
            this.validationError.next({ file, error: FileValidationTypes.extensions });
            return false;
        }
        return true;
    }
    /** Validates selected file size and total file size */
    isValidSize(newFile, newFileSize) {
        /** Validating selected file size */
        const isValidFileSize = this.fileValidatorService.isValidFileSize(newFileSize, this.fileMaxSize);
        const isValidTotalFileSize = this.fileValidatorService.isValidTotalFileSize(newFile, this.files, this.totalMaxSize);
        if (!isValidFileSize) {
            this.validationError.next({
                file: newFile,
                error: FileValidationTypes.fileMaxSize
            });
        }
        /** Validating Total Files Size */
        if (!isValidTotalFileSize) {
            this.validationError.next({
                file: newFile,
                error: FileValidationTypes.totalMaxSize
            });
        }
        ;
        return isValidFileSize && isValidTotalFileSize;
    }
    /** when crop button submitted */
    onCropSubmit() {
        const mimeType = lookup(this.currentCropperFile.name);
        if (!mimeType) {
            throw new Error("mimeType not found");
        }
        this.isCroppingBusy = true;
        this.cropper
            .getCroppedCanvas(this.croppedCanvasOptions)
            .toBlob(this._blobFallBack.bind(this), mimeType);
    }
    /** After crop submit */
    _blobFallBack(blob) {
        if (!blob) {
            return;
        }
        if (this.isValidSize(blob, blob.size)) {
            this.pushFile(blob, this.currentCropperFile.name);
        }
        this.closeCropper({
            file: blob,
            fileName: this.currentCropperFile.name
        });
        this.isCroppingBusy = false;
        this.changeRef.detectChanges();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePickerComponent, deps: [{ token: FilePickerService }, { token: FileValidatorService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.7", type: FilePickerComponent, isStandalone: false, selector: "ngx-awesome-uploader", inputs: { customValidator: "customValidator", enableCropper: "enableCropper", showeDragDropZone: "showeDragDropZone", showPreviewContainer: "showPreviewContainer", itemTemplate: "itemTemplate", uploadType: "uploadType", fileMaxSize: "fileMaxSize", fileMaxCount: "fileMaxCount", totalMaxSize: "totalMaxSize", accept: "accept", fileExtensions: "fileExtensions", cropperOptions: "cropperOptions", croppedCanvasOptions: "croppedCanvasOptions", adapter: "adapter", dropzoneTemplate: "dropzoneTemplate", captions: "captions", enableAutoUpload: "enableAutoUpload", fileInputCapture: "fileInputCapture" }, outputs: { uploadSuccess: "uploadSuccess", uploadFail: "uploadFail", removeSuccess: "removeSuccess", validationError: "validationError", fileAdded: "fileAdded", fileRemoved: "fileRemoved" }, ngImport: i0, template: "<div\n  (click)=\"fileInput.click()\"\n  class=\"file-drop-wrapper\"\n  *ngIf=\"showeDragDropZone\"\n>\n  <file-drop\n    (onFileDrop)=\"dropped($event)\"\n    [customstyle]=\"'custom-drag'\"\n    [captions]=\"captions\"\n  >\n    <ng-content select=\".dropzoneTemplate\"> </ng-content>\n  </file-drop>\n</div>\n\n<input\n  type=\"file\"\n  name=\"file[]\"\n  id=\"fileInput\"\n  #fileInput\n  [multiple]=\"uploadType === 'multi' ? 'multiple' : ''\"\n  [attr.capture]=\"fileInputCapture\"\n  (click)=\"fileInput.value = null\"\n  (change)=\"onChange(fileInput.files)\"\n  [accept]=\"accept\"\n  class=\"file-input\"\n/>\n\n<div class=\"cropperJsOverlay\" *ngIf=\"currentCropperFile\">\n<div class=\"cropperJsBox\">\n  <img\n    [src]=\"safeCropImgUrl\"\n    id=\"cropper-img\"\n    (load)=\"cropperImgLoaded($event)\"\n  />\n  <div class=\"cropper-actions\">\n    <button class=\"cropSubmit\"\n    (click)=\"onCropSubmit()\"\n    [disabled]=\"isCroppingBusy\"\n    type=\"button\" [ngClass]=\"{'is-loading':isCroppingBusy }\"\n    >\n      {{ captions?.cropper?.crop }}\n    </button>\n    <button\n      class=\"cropCancel\"\n      type=\"button\"\n      (click)=\"\n        closeCropper({\n          file: currentCropperFile,\n          fileName: currentCropperFile.name\n        })\n      \"\n    >\n      {{ captions?.cropper?.cancel }}\n    </button>\n  </div>\n</div>\n</div>\n\n<div\n  class=\"files-preview-wrapper\"\n  [ngClass]=\"{ 'visually-hidden': !showPreviewContainer }\"\n>\n  <file-preview-container\n    *ngIf=\"files\"\n    [previewFiles]=\"files\"\n    (removeFile)=\"removeFile($event)\"\n    (uploadSuccess)=\"onUploadSuccess($event)\"\n    (uploadFail)=\"onUploadFail($event)\"\n    [adapter]=\"adapter\"\n    [itemTemplate]=\"itemTemplate\"\n    [captions]=\"captions\"\n    [enableAutoUpload]=\"enableAutoUpload\"\n  >\n  </file-preview-container>\n</div>\n", styles: ["*{box-sizing:border-box}:host{display:flex;flex-direction:column;align-items:center;width:100%;height:100%;overflow:auto;max-width:440px;border-radius:6px}.files-preview-wrapper{width:100%}#cropper-img{max-width:60vw;display:none}#cropper-img img{width:100%;height:100%}.file-drop-wrapper{width:100%;background:#fafbfd;padding-top:20px}.preview-container{display:flex}.cropperJsOverlay{display:flex;justify-content:center;align-items:center;position:fixed;z-index:999;top:0;left:0;width:100vw;height:100vh;background:#00000052}.cropperJsBox{display:flex;flex-direction:column;justify-content:center;align-items:center;max-height:calc(100vh - 88px);max-width:90vw}.cropperJsBox .cropper-actions{display:flex}.cropperJsBox .cropper-actions button{margin:5px;padding:12px 25px;border-radius:6px;border:0;cursor:pointer}.cropperJsBox .cropper-actions .cropSubmit{color:#fff;background:#16a085}::ng-deep .cropper img{max-height:300px!important}#images{display:flex;justify-content:center;width:500px;overflow-x:auto}#images .image{flex:0 0 100px;margin:0 2px;display:flex;flex-direction:column;align-items:flex-end}#fileInput{display:none}.uploader-submit-btn{background:#ffd740;color:#000000de;border:0;padding:0 16px;line-height:36px;font-size:15px;margin-top:12px;border-radius:4px;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;cursor:pointer}button:disabled{color:#00000042;background:#dcdcdc}.visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;outline:0;-webkit-appearance:none;-moz-appearance:none}button.is-loading{color:#00000042!important;background-color:#fff!important;box-shadow:none;cursor:not-allowed;outline:none}button.is-loading:after{content:\"\";font-family:sans-serif;font-weight:100;-webkit-animation:1.25s linear infinite three-quarters;animation:1.25s linear infinite three-quarters;border:3px solid #7f8c8d;border-right-color:transparent;border-radius:100%;box-sizing:border-box;display:inline-block;position:relative;vertical-align:middle;overflow:hidden;text-indent:-9999px;width:18px;height:18px;opacity:1;margin-left:10px}@keyframes three-quarters{0%{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: FileComponent, selector: "file-drop", inputs: ["captions", "customstyle", "disableIf"], outputs: ["onFileDrop", "onFileOver", "onFileLeave"] }, { kind: "component", type: FilePreviewContainerComponent, selector: "file-preview-container", inputs: ["previewFiles", "itemTemplate", "enableAutoUpload", "adapter", "captions"], outputs: ["removeFile", "uploadSuccess", "uploadFail"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-awesome-uploader', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<div\n  (click)=\"fileInput.click()\"\n  class=\"file-drop-wrapper\"\n  *ngIf=\"showeDragDropZone\"\n>\n  <file-drop\n    (onFileDrop)=\"dropped($event)\"\n    [customstyle]=\"'custom-drag'\"\n    [captions]=\"captions\"\n  >\n    <ng-content select=\".dropzoneTemplate\"> </ng-content>\n  </file-drop>\n</div>\n\n<input\n  type=\"file\"\n  name=\"file[]\"\n  id=\"fileInput\"\n  #fileInput\n  [multiple]=\"uploadType === 'multi' ? 'multiple' : ''\"\n  [attr.capture]=\"fileInputCapture\"\n  (click)=\"fileInput.value = null\"\n  (change)=\"onChange(fileInput.files)\"\n  [accept]=\"accept\"\n  class=\"file-input\"\n/>\n\n<div class=\"cropperJsOverlay\" *ngIf=\"currentCropperFile\">\n<div class=\"cropperJsBox\">\n  <img\n    [src]=\"safeCropImgUrl\"\n    id=\"cropper-img\"\n    (load)=\"cropperImgLoaded($event)\"\n  />\n  <div class=\"cropper-actions\">\n    <button class=\"cropSubmit\"\n    (click)=\"onCropSubmit()\"\n    [disabled]=\"isCroppingBusy\"\n    type=\"button\" [ngClass]=\"{'is-loading':isCroppingBusy }\"\n    >\n      {{ captions?.cropper?.crop }}\n    </button>\n    <button\n      class=\"cropCancel\"\n      type=\"button\"\n      (click)=\"\n        closeCropper({\n          file: currentCropperFile,\n          fileName: currentCropperFile.name\n        })\n      \"\n    >\n      {{ captions?.cropper?.cancel }}\n    </button>\n  </div>\n</div>\n</div>\n\n<div\n  class=\"files-preview-wrapper\"\n  [ngClass]=\"{ 'visually-hidden': !showPreviewContainer }\"\n>\n  <file-preview-container\n    *ngIf=\"files\"\n    [previewFiles]=\"files\"\n    (removeFile)=\"removeFile($event)\"\n    (uploadSuccess)=\"onUploadSuccess($event)\"\n    (uploadFail)=\"onUploadFail($event)\"\n    [adapter]=\"adapter\"\n    [itemTemplate]=\"itemTemplate\"\n    [captions]=\"captions\"\n    [enableAutoUpload]=\"enableAutoUpload\"\n  >\n  </file-preview-container>\n</div>\n", styles: ["*{box-sizing:border-box}:host{display:flex;flex-direction:column;align-items:center;width:100%;height:100%;overflow:auto;max-width:440px;border-radius:6px}.files-preview-wrapper{width:100%}#cropper-img{max-width:60vw;display:none}#cropper-img img{width:100%;height:100%}.file-drop-wrapper{width:100%;background:#fafbfd;padding-top:20px}.preview-container{display:flex}.cropperJsOverlay{display:flex;justify-content:center;align-items:center;position:fixed;z-index:999;top:0;left:0;width:100vw;height:100vh;background:#00000052}.cropperJsBox{display:flex;flex-direction:column;justify-content:center;align-items:center;max-height:calc(100vh - 88px);max-width:90vw}.cropperJsBox .cropper-actions{display:flex}.cropperJsBox .cropper-actions button{margin:5px;padding:12px 25px;border-radius:6px;border:0;cursor:pointer}.cropperJsBox .cropper-actions .cropSubmit{color:#fff;background:#16a085}::ng-deep .cropper img{max-height:300px!important}#images{display:flex;justify-content:center;width:500px;overflow-x:auto}#images .image{flex:0 0 100px;margin:0 2px;display:flex;flex-direction:column;align-items:flex-end}#fileInput{display:none}.uploader-submit-btn{background:#ffd740;color:#000000de;border:0;padding:0 16px;line-height:36px;font-size:15px;margin-top:12px;border-radius:4px;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;cursor:pointer}button:disabled{color:#00000042;background:#dcdcdc}.visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;outline:0;-webkit-appearance:none;-moz-appearance:none}button.is-loading{color:#00000042!important;background-color:#fff!important;box-shadow:none;cursor:not-allowed;outline:none}button.is-loading:after{content:\"\";font-family:sans-serif;font-weight:100;-webkit-animation:1.25s linear infinite three-quarters;animation:1.25s linear infinite three-quarters;border:3px solid #7f8c8d;border-right-color:transparent;border-radius:100%;box-sizing:border-box;display:inline-block;position:relative;vertical-align:middle;overflow:hidden;text-indent:-9999px;width:18px;height:18px;opacity:1;margin-left:10px}@keyframes three-quarters{0%{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}\n"] }]
        }], ctorParameters: () => [{ type: FilePickerService }, { type: FileValidatorService }, { type: i0.ChangeDetectorRef }], propDecorators: { uploadSuccess: [{
                type: Output
            }], uploadFail: [{
                type: Output
            }], removeSuccess: [{
                type: Output
            }], validationError: [{
                type: Output
            }], fileAdded: [{
                type: Output
            }], fileRemoved: [{
                type: Output
            }], customValidator: [{
                type: Input
            }], enableCropper: [{
                type: Input
            }], showeDragDropZone: [{
                type: Input
            }], showPreviewContainer: [{
                type: Input
            }], itemTemplate: [{
                type: Input
            }], uploadType: [{
                type: Input
            }], fileMaxSize: [{
                type: Input
            }], fileMaxCount: [{
                type: Input
            }], totalMaxSize: [{
                type: Input
            }], accept: [{
                type: Input
            }], fileExtensions: [{
                type: Input
            }], cropperOptions: [{
                type: Input
            }], croppedCanvasOptions: [{
                type: Input
            }], adapter: [{
                type: Input
            }], dropzoneTemplate: [{
                type: Input
            }], captions: [{
                type: Input
            }], enableAutoUpload: [{
                type: Input
            }], fileInputCapture: [{
                type: Input
            }] } });

class FileDropModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FileDropModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.1.7", ngImport: i0, type: FileDropModule, bootstrap: [FileComponent], declarations: [FileComponent,
            CloudIconComponent], imports: [CommonModule], exports: [FileComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FileDropModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FileDropModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        FileComponent,
                        CloudIconComponent
                    ],
                    exports: [FileComponent],
                    imports: [CommonModule],
                    providers: [],
                    bootstrap: [FileComponent],
                }]
        }] });

class FilePickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.1.7", ngImport: i0, type: FilePickerModule, declarations: [FilePickerComponent,
            FilePreviewContainerComponent,
            FilePreviewItemComponent,
            PreviewLightboxComponent,
            RefreshIconComponent,
            CloseIconComponent], imports: [CommonModule,
            FileDropModule], exports: [FilePickerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePickerModule, providers: [FilePickerService], imports: [CommonModule,
            FileDropModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: FilePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FileDropModule,
                    ],
                    declarations: [
                        FilePickerComponent,
                        FilePreviewContainerComponent,
                        FilePreviewItemComponent,
                        PreviewLightboxComponent,
                        RefreshIconComponent,
                        CloseIconComponent
                    ],
                    exports: [FilePickerComponent],
                    providers: [FilePickerService]
                }]
        }] });

/*
 * Public API Surface of file-picker
 */

/**
 * Generated bundle index. Do not edit.
 */

export { FilePickerAdapter, FilePickerComponent, FilePickerModule, FilePickerService, FileValidationTypes, UploadStatus };
//# sourceMappingURL=ngx-awesome-uploader.mjs.map
