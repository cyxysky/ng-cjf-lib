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
import { VirtualScrollComponent } from '../doc/virtual-scroll/virtual-scroll.component';
import { TestComponent } from '../doc/test/test.component';
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'virtual-scroll',
        pathMatch: 'full'
    },
    {
        path: 'virtual-scroll',
        component: VirtualScrollComponent,
    },
    {
        path: 'unlock',
        component: UnlockComponent
    },
    {
        path: 'start',
        component: DocStartComponent,
    },
    {
        path: 'popconfirm',
        component: DocPopconfirmComponent,
    },
    {
        path: 'popover',
        component: DocPopoverComponent,
    },
    {
        path: 'button',
        component: DocButtonComponent,
    },
    {
        path: 'switch',
        component: DocSwitchComponent,
    },
    {
        path: 'tag',
        component: DocTagComponent,
    },
    {
        path: 'number-input',
        component: DocNumberInputComponent,
    },
    {
        path: 'segmented',
        component: DocSegmentedComponent,
    },
    {
        path: 'water-mark',
        component: DocWaterMarkComponent,
    },
    {
        path: 'flowchart',
        component: DocFlowchartComponent,
    },
    {
        path: 'input',
        component: DocInputComponent,
    },
    {
        path: 'tooltip',
        component: DocTooltipComponent,
    },
    {
        path: 'checkbox',
        component: DocCheckboxComponent,
    },
    {
        path: 'radio',
        component: DocRadioComponent,
    },
    {
        path: 'slider',
        component: DocSliderComponent,
    },
    {
        path: 'modal',
        component: DocModalComponent,
    },
    {
        path: 'tabs',
        component: DocTabsComponent,
    },
    {
        path: 'date-timer',
        component: DocDateTimerComponent,
    },
    {
        path: 'message',
        component: DocMessageComponent,
    },
    {
        path: 'drawer',
        component: DocDrawerComponent,
    },
    {
        path: 'drop-menu',
        component: DocDropMenuComponent,
    },
    {
        path: 'tree',
        component: DocTreeComponent,
    },
    {
        path: 'tree-select',
        component: DocTreeSelectComponent,
    },
    {
        path: 'cascader',
        component: DocCascaderComponent,
    },
    {
        path: 'structure-tree',
        component: DocStructureTreeComponent,
    },
    {
        path: 'select',
        component: DocSelectComponent,
    },
    {
        path: 'multi-dimensional-flowchart',
        component: DocFlowchartComponent,
    },
    {
        path: 'customer-form',
        component: CustomerFormComponent,
    },
    {
        path: 'process-tree',
        component: ProcessTreeComponent,
    },
    {
        path: 'generate-png',
        component: GeneratePngComponent,
    },
    {
        path: 'dynamic-table',
        component: DynamicTableComponent,
    },
    {
        path: 'user-select',
        component: UserSelectComponent,
    },
    {
        path: 'menu',
        component: DocMenuComponent,
    },
    {
        path: 'table',
        component: DocTableComponent,
    },
    {
        path: 'chart',
        component: DocChartComponent,
    },
    {
        path: 'test',
        component: TestComponent,
    }
];
