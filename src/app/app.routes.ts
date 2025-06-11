import { Routes } from '@angular/router';
import { DocPopconfirmComponent } from '../doc/doc-popconfirm/doc-popconfirm.component';
import { DocPopoverComponent } from '../doc/doc-popover/doc-popover.component';
import { DocButtonComponent } from '../doc/doc-button/doc-button.component';
import { DocSwitchComponent } from '../doc/doc-switch/doc-switch.component';
import { DocTagComponent } from '../doc/doc-tag/doc-tag.component';
import { DocNumberInputComponent } from '../doc/doc-number-input/doc-number-input.component';
import { DocSegmentedComponent } from '../doc/doc-segmented/doc-segmented.component';
import { DocWaterMarkComponent } from '../doc/doc-water-mark/doc-water-mark.component';
import { DocFlowchartComponent } from '../doc/doc-flowchart/doc-flowchart.component';
import { DocInputComponent } from '../doc/doc-input/doc-input.component';
import { DocTooltipComponent } from '../doc/doc-tooltip/doc-tooltip.component';
import { DocCheckboxComponent } from '../doc/doc-checkbox/doc-checkbox.component';
import { DocRadioComponent } from '../doc/doc-radio/doc-radio.component';
import { DocSliderComponent } from '../doc/doc-slider/doc-slider.component';
import { DocModalComponent } from '../doc/doc-modal/doc-modal.component';
import { DocTabsComponent } from '../doc/doc-tabs/doc-tabs.component';
import { DocDateTimerComponent } from '../doc/doc-date-timer/doc-date-timer.component';
import { DocMessageComponent } from '../doc/doc-message/doc-message.component';
import { DocDrawerComponent } from '../doc/doc-drawer/doc-drawer.component';
import { DocDropMenuComponent } from '../doc/doc-drop-menu/doc-drop-menu.component';
import { DocTreeComponent } from '../doc/doc-tree/doc-tree.component';
import { DocTreeSelectComponent } from '../doc/doc-tree-select/doc-tree-select.component';
import { DocCascaderComponent } from '../doc/doc-cascader/doc-cascader.component';
import { DocStructureTreeComponent } from '../doc/doc-structure-tree/doc-structure-tree.component';
import { DocSelectComponent } from '../doc/doc-select/doc-select.component';
import { CustomerFormComponent } from '@project';
import { ProcessTreeComponent } from '@project';
import { GeneratePngComponent } from '@project';
import { DynamicTableComponent } from '@project';
import { UserSelectComponent } from '@project';
import { DocMenuComponent } from '../doc/doc-menu/doc-menu.component';
import { DocTableComponent } from '../doc/doc-table/doc-table.component';
import { DocChartComponent } from '../doc/doc-chart/doc-chart.component';
import { DocStartComponent } from '../doc/doc-start/doc-start.component';
import { UnlockComponent } from './unlock/unlock.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'start',
        pathMatch: 'full'
    },
    {
        path: 'unlock',
        component: UnlockComponent
    },
    {
        path: 'start',
        component: DocStartComponent,
        canActivate: [authGuard]
    },
    {
        path: 'popconfirm',
        component: DocPopconfirmComponent,
        canActivate: [authGuard]
    },
    {
        path: 'popover',
        component: DocPopoverComponent,
        canActivate: [authGuard]
    },
    {
        path: 'button',
        component: DocButtonComponent,
        canActivate: [authGuard]
    },
    {
        path: 'switch',
        component: DocSwitchComponent,
        canActivate: [authGuard]
    },
    {
        path: 'tag',
        component: DocTagComponent,
        canActivate: [authGuard]
    },
    {
        path: 'number-input',
        component: DocNumberInputComponent,
        canActivate: [authGuard]
    },
    {
        path: 'segmented',
        component: DocSegmentedComponent,
        canActivate: [authGuard]
    },
    {
        path: 'water-mark',
        component: DocWaterMarkComponent,
        canActivate: [authGuard]
    },
    {
        path: 'flowchart',
        component: DocFlowchartComponent,
        canActivate: [authGuard]
    },
    {
        path: 'input',
        component: DocInputComponent,
        canActivate: [authGuard]
    },
    {
        path: 'tooltip',
        component: DocTooltipComponent,
        canActivate: [authGuard]
    },
    {
        path: 'checkbox',
        component: DocCheckboxComponent,
        canActivate: [authGuard]
    },
    {
        path: 'radio',
        component: DocRadioComponent,
        canActivate: [authGuard]
    },
    {
        path: 'slider',
        component: DocSliderComponent,
        canActivate: [authGuard]
    },
    {
        path: 'modal',
        component: DocModalComponent,
        canActivate: [authGuard]
    },
    {
        path: 'tabs',
        component: DocTabsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'date-timer',
        component: DocDateTimerComponent,
        canActivate: [authGuard]
    },
    {
        path: 'message',
        component: DocMessageComponent,
        canActivate: [authGuard]
    },
    {
        path: 'drawer',
        component: DocDrawerComponent,
        canActivate: [authGuard]
    },
    {
        path: 'drop-menu',
        component: DocDropMenuComponent,
        canActivate: [authGuard]
    },
    {
        path: 'tree',
        component: DocTreeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'tree-select',
        component: DocTreeSelectComponent,
        canActivate: [authGuard]
    },
    {
        path: 'cascader',
        component: DocCascaderComponent,
        canActivate: [authGuard]
    },
    {
        path: 'structure-tree',
        component: DocStructureTreeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'select',
        component: DocSelectComponent,
        canActivate: [authGuard]
    },
    {
        path: 'multi-dimensional-flowchart',
        component: DocFlowchartComponent,
        canActivate: [authGuard]
    },
    {
        path: 'customer-form',
        component: CustomerFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'process-tree',
        component: ProcessTreeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'generate-png',
        component: GeneratePngComponent,
        canActivate: [authGuard]
    },
    {
        path: 'dynamic-table',
        component: DynamicTableComponent,
        canActivate: [authGuard]
    },
    {
        path: 'user-select',
        component: UserSelectComponent,
        canActivate: [authGuard]
    },
    {
        path: 'menu',
        component: DocMenuComponent,
        canActivate: [authGuard]
    },
    {
        path: 'table',
        component: DocTableComponent,
        canActivate: [authGuard]
    },
    {
        path: 'chart',
        component: DocChartComponent,
        canActivate: [authGuard]
    }
];
