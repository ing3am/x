import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxDataGridModule, DxNumberBoxModule, DxDateBoxModule, DxBulletModule, DxTemplateModule, DxButtonModule, DxCheckBoxModule, DxFileUploaderModule, DxTextBoxModule, DxDropDownBoxModule, DxHtmlEditorModule, DxValidatorModule, DxFileManagerModule, DxColorBoxModule, DxTooltipModule } from 'devextreme-angular';




@NgModule({
    exports: [
        DxDataGridModule, DxNumberBoxModule, DxDateBoxModule, DxBulletModule, DxTemplateModule, DxButtonModule, DxCheckBoxModule, DxFileUploaderModule, DxTextBoxModule, DxDropDownBoxModule, DxHtmlEditorModule, DxValidatorModule, DxFileManagerModule, DxColorBoxModule, DxTooltipModule
    ],
    declarations: [],
    imports: [
        CommonModule,
        DxDataGridModule, DxNumberBoxModule, DxDateBoxModule, DxBulletModule, DxTemplateModule, DxButtonModule, DxCheckBoxModule, DxFileUploaderModule, DxTextBoxModule, DxDropDownBoxModule, DxHtmlEditorModule, DxValidatorModule, DxFileManagerModule, DxColorBoxModule, DxTooltipModule
    ]
})
export class DevExtremeModule { }
