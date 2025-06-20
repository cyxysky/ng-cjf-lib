import { Component, OnInit } from '@angular/core';

import { CascaderComponent } from '@project';
import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';

@Component({
  selector: 'app-doc-cascader',
  standalone: true,
  imports: [
    CascaderComponent,
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent
],
  templateUrl: './doc-cascader.component.html',
  styleUrl: './doc-cascader.component.less'
})
export class DocCascaderComponent implements OnInit {
  // 基本用法
  selectedValue: string[] = [];
  
  // 三种大小
  selectedSizes = {
    large: [['zhejiang', 'hangzhou', 'xihu']],
    default: [['zhejiang']],
    small: [['zhejiang','ningbo']]
  };
  
  // 移入展开
  hoverValue: string[] = [];
  
  // 选择即改变
  changeOnSelectValue: string[] = [];
  
  // 多选模式
  multipleSelected: string[] = [];
  
  // 禁用选项
  disabledOptionValue: string[] = [];
  disabledOptions = [
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            {
              value: 'xihu',
              label: '西湖',
            },
            {
              value: 'xiasha',
              label: '下沙',
              disabled: true,
            },
          ],
        },
        {
          value: 'ningbo',
          label: '宁波',
          disabled: true,
          children: [
            {
              value: 'jiangbei',
              label: '江北',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: '江苏',
      children: [
        {
          value: 'nanjing',
          label: '南京',
          children: [
            {
              value: 'xuanwu',
              label: '玄武湖',
            }
          ],
        },
        {
          value: 'suzhou',
          label: '苏州',
          children: [
            {
              value: 'jinjihu',
              label: '金鸡湖',
            }
          ],
        }
      ],
    }
  ];
  
  // 搜索功能
  searchSelected: string[] = [];
  
  // 自定义字段名
  customFieldValue: string[] = [];
  customFieldOptions: any = [
    {
      id: 'zhejiang',
      name: '浙江',
      items: [
        {
          id: 'hangzhou',
          name: '杭州',
          items: [
            {
              id: 'xihu',
              name: '西湖',
            }
          ],
        }
      ],
    },
    {
      id: 'jiangsu',
      name: '江苏',
      items: [
        {
          id: 'nanjing',
          name: '南京',
          items: [
            {
              id: 'xuanwu',
              name: '玄武湖',
            }
          ],
        }
      ],
    }
  ];
  customFields = {
    label: 'name',
    value: 'id',
    children: 'items'
  };
  
  // 自定义选择函数
  optionSelectFnValue: string[] = [];
  
  // 多选时禁用复选框
  disableCheckboxValue: string[] = [];
  disableCheckboxOptions = [
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            {
              value: 'xihu',
              label: '西湖',
            },
            {
              value: 'xiasha',
              label: '下沙',
              disableCheckbox: true,
            },
          ],
        },
        {
          value: 'ningbo',
          label: '宁波',
          children: [
            {
              value: 'jiangbei',
              label: '江北',
              disableCheckbox: true,
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: '江苏',
      children: [
        {
          value: 'nanjing',
          label: '南京',
          children: [
            {
              value: 'xuanwu',
              label: '玄武湖',
            }
          ],
        }
      ],
    }
  ];
  
  // 自定义选项模板
  customTemplateValue: string[] = [];
  customOptions = [
    {
      value: 'food',
      label: '食品',
      icon: 'bi-egg-fried',
      children: [
        {
          value: 'fruit',
          label: '水果',
          icon: 'bi-apple',
          children: [
            {
              value: 'apple',
              label: '苹果',
              icon: 'bi-apple',
              description: '每天一苹果，医生远离我'
            },
            {
              value: 'banana',
              label: '香蕉',
              icon: 'bi-egg',
              description: '富含钾元素'
            }
          ]
        },
        {
          value: 'vegetable',
          label: '蔬菜',
          icon: 'bi-flower1',
          children: [
            {
              value: 'tomato',
              label: '西红柿',
              icon: 'bi-circle-fill',
              description: '红色蔬菜'
            }
          ]
        }
      ]
    },
    {
      value: 'electronic',
      label: '电子产品',
      icon: 'bi-laptop',
      children: [
        {
          value: 'phone',
          label: '手机',
          icon: 'bi-phone',
          children: [
            {
              value: 'apple-phone',
              label: 'iPhone',
              icon: 'bi-apple',
              description: '苹果手机'
            },
            {
              value: 'android',
              label: '安卓手机',
              icon: 'bi-android',
              description: '安卓系统'
            }
          ]
        }
      ]
    }
  ];
  
  // 自定义状态
  statusValues = {
    default: [],
    error: [],
    warning: []
  };
  
  // 无边框
  borderlessValue: string[] = [];
  
  // 禁用选择框
  disabledValue: string[] = [];
  
  // 基础选项
  options = [
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            {
              value: 'xihu',
              label: '西湖',
            },
            {
              value: 'yuhang',
              label: '余杭',
            },
          ],
        },
        {
          value: 'ningbo',
          label: '宁波',
          children: [
            {
              value: 'jiangbei',
              label: '江北',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: '江苏',
      children: [
        {
          value: 'nanjing',
          label: '南京',
          children: [
            {
              value: 'xuanwu',
              label: '玄武湖',
            }
          ],
        },
        {
          value: 'suzhou',
          label: '苏州',
          children: [
            {
              value: 'jinjihu',
              label: '金鸡湖',
            },
            {
              value: 'shihu',
              label: '石湖',
            }
          ],
        }
      ],
    }
  ];
  
  // 大量选项用于搜索
  largeOptions: any[] = [];
  
  ngOnInit(): void {
    // 初始化大量选项
    this.initLargeOptions();
  }
  con(dta: any) {
    console.log(dta);
  }
  
  // 初始化大量选项
  initLargeOptions() {
    const provinces = ['浙江', '江苏', '安徽', '河南', '山东', '广东', '福建', '湖南'];
    
    this.largeOptions = provinces.map(province => {
      const cities = [];
      for (let i = 1; i <= 5; i++) {
        const districts = [];
        for (let j = 1; j <= 3; j++) {
          districts.push({
            value: `${province}-city${i}-district${j}`,
            label: `${province}市${i}区${j}`
          });
        }
        
        cities.push({
          value: `${province}-city${i}`,
          label: `${province}市${i}`,
          children: districts
        });
      }
      
      return {
        value: province,
        label: province,
        children: cities
      };
    });
  }
  
  // 自定义选择函数 - 只允许选择城市，不允许选择省份
  customSelectFunction = (option: any) => {
    return !option.label.includes('西湖');
  };
  
  // 获取显示文本
  getDisplayText(values: string[]): string {
    if (!values || values.length === 0) {
      return '';
    }
    return values.join(' / ');
  }
  
  // API 文档数据
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'cascaderOptions', description: '可选项数据源', type: 'CascaderOption[]', default: '[]' },
        { name: 'cascaderExpandTrigger', description: '次级菜单的展开方式', type: "'click' | 'hover'", default: "'click'" },
        { name: 'cascaderActionTrigger', description: '触发方式', type: "'click' | 'hover'", default: "'click'" },
        { name: 'cascaderShowSearch', description: '是否支持搜索', type: 'boolean', default: 'true' },
        { name: 'cascaderDisabled', description: '是否禁用', type: 'boolean', default: 'false' },
        { name: 'cascaderPlaceholder', description: '输入框占位文本', type: 'string', default: "'请选择'" },
        { name: 'cascaderAllowClear', description: '是否支持清除', type: 'boolean', default: 'true' },
        { name: 'cascaderChangeOnSelect', description: '是否选择即触发改变', type: 'boolean', default: 'false' },
        { name: 'cascaderIsMultiple', description: '是否多选', type: 'boolean', default: 'false' },
        { name: 'cascaderSize', description: '输入框大小', type: "'large' | 'default' | 'small'", default: "'default'" },
        { name: 'cascaderFieldNames', description: '自定义节点字段名', type: '{ label: string; value: string; children: string; }', default: "{ label: 'label', value: 'value', children: 'children' }" },
        { name: 'cascaderBorderless', description: '是否无边框', type: 'boolean', default: 'false' },
        { name: 'cascaderStatus', description: '设置校验状态', type: "'error' | 'warning' | null", default: 'null' },
        { name: 'cascaderMenuWidth', description: '下拉菜单的宽度', type: 'number', default: '160' },
        { name: 'cascaderOptionTemplate', description: '自定义选项模板', type: 'TemplateRef<any>', default: 'null' },
        { name: 'cascaderOptionLabelTemplate', description: '自定义选中标签模板', type: 'TemplateRef<any>', default: 'null' },
        { name: 'cascaderLoading', description: '是否加载中', type: 'boolean', default: 'false' },
        { name: 'cascaderOptionFilterFn', description: '自定义搜索过滤函数', type: '(inputValue: string, option: CascaderOption, path: CascaderOption[]) => boolean', default: '-' },
        { name: 'cascaderOptionSelectFn', description: '自定义选择判断函数', type: '(option: CascaderOption) => boolean', default: '-' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'cascaderSelectionChange', description: '选项变化时的回调', type: 'EventEmitter<CascaderOption[]>', default: '-' },
        { name: 'cascaderVisibleChange', description: '菜单显示状态改变时的回调', type: 'EventEmitter<boolean>', default: '-' },
        { name: 'cascaderSearch', description: '搜索输入变化时的回调', type: 'EventEmitter<string>', default: '-' }
      ]
    },
    {
      title: 'CascaderOption 属性',
      items: [
        { name: 'value', description: '选项值', type: 'any', default: '-' },
        { name: 'label', description: '选项显示文本', type: 'string', default: '-' },
        { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
        { name: 'children', description: '子选项列表', type: 'CascaderOption[]', default: '-' },
        { name: 'isLeaf', description: '是否是叶子节点', type: 'boolean', default: 'false' },
        { name: 'disableCheckbox', description: '多选时是否禁用复选框', type: 'boolean', default: 'false' }
      ]
    }
  ];
  
  // 示例代码
  basicSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-basic-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <lib-cascader
      [(ngModel)]="selectedValue"
      [cascaderOptions]="options"
      [cascaderPlaceholder]="'请选择'">
    </lib-cascader>
    <div *ngIf="selectedValue && selectedValue.length" class="example-value">
      当前选择: {{ getDisplayText(selectedValue) }}
    </div>
  \`
})
export class BasicExampleComponent {
  selectedValue: string[] = [];
  
  options = [
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            {
              value: 'xihu',
              label: '西湖'
            }
          ]
        }
      ]
    },
    {
      value: 'jiangsu',
      label: '江苏',
      children: [
        {
          value: 'nanjing',
          label: '南京',
          children: [
            {
              value: 'xuanwu',
              label: '玄武湖'
            }
          ]
        }
      ]
    }
  ];
  
  getDisplayText(values: string[]): string {
    if (!values || values.length === 0) {
      return '';
    }
    return values.join(' / ');
  }
}
  `;
  
  sizeSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-size-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <div class="size-container">
      <lib-cascader
        [cascaderSize]="'large'"
        [(ngModel)]="selectedSizes.large"
        [cascaderOptions]="options"
        [cascaderPlaceholder]="'大号级联选择'">
      </lib-cascader>
      
      <lib-cascader
        [(ngModel)]="selectedSizes.default"
        [cascaderOptions]="options"
        [cascaderPlaceholder]="'默认大小'">
      </lib-cascader>
      
      <lib-cascader
        [cascaderSize]="'small'"
        [(ngModel)]="selectedSizes.small"
        [cascaderOptions]="options"
        [cascaderPlaceholder]="'小号级联选择'">
      </lib-cascader>
    </div>
  \`,
  styles: ['.size-container { display: flex; flex-direction: column; gap: 16px; }']
})
export class SizeExampleComponent {
  selectedSizes = {
    large: [],
    default: [],
    small: []
  };
  
  options = [
    // 级联选择器选项数据...
  ];
}
  `;
  
  hoverExpandSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-hover-expand-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <lib-cascader
      [(ngModel)]="hoverValue"
      [cascaderOptions]="options"
      [cascaderExpandTrigger]="'hover'"
      [cascaderPlaceholder]="'鼠标移入展开菜单'">
    </lib-cascader>
    <div *ngIf="hoverValue && hoverValue.length" class="example-value">
      当前选择: {{ getDisplayText(hoverValue) }}
    </div>
  \`
})
export class HoverExpandExampleComponent {
  hoverValue: string[] = [];
  
  options = [
    // 级联选择器选项数据...
  ];
  
  getDisplayText(values: string[]): string {
    if (!values || values.length === 0) {
      return '';
    }
    return values.join(' / ');
  }
}
  `;
  
  changeOnSelectSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-change-on-select-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <lib-cascader
      [(ngModel)]="changeOnSelectValue"
      [cascaderOptions]="options"
      [cascaderChangeOnSelect]="true"
      [cascaderPlaceholder]="'选择即改变'">
    </lib-cascader>
    <div *ngIf="changeOnSelectValue && changeOnSelectValue.length" class="example-value">
      当前选择: {{ getDisplayText(changeOnSelectValue) }}
    </div>
  \`
})
export class ChangeOnSelectExampleComponent {
  changeOnSelectValue: string[] = [];
  
  options = [
    // 级联选择器选项数据...
  ];
  
  getDisplayText(values: string[]): string {
    if (!values || values.length === 0) {
      return '';
    }
    return values.join(' / ');
  }
}
  `;
  
  multipleSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-multiple-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <lib-cascader
      [(ngModel)]="multipleSelected"
      [cascaderOptions]="options"
      [cascaderIsMultiple]="true"
      [cascaderPlaceholder]="'请选择多个选项'">
    </lib-cascader>
    <div *ngIf="multipleSelected && multipleSelected.length > 0" class="example-value">
      当前选择: {{ multipleSelected.join(', ') }}
    </div>
  \`
})
export class MultipleExampleComponent {
  multipleSelected: string[] = [];
  
  options = [
    // 级联选择器选项数据...
  ];
}
  `;
  
  disabledOptionSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-disabled-option-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <lib-cascader
      [(ngModel)]="disabledOptionValue"
      [cascaderOptions]="disabledOptions"
      [cascaderPlaceholder]="'包含禁用选项'">
    </lib-cascader>
    <div *ngIf="disabledOptionValue && disabledOptionValue.length" class="example-value">
      当前选择: {{ getDisplayText(disabledOptionValue) }}
    </div>
  \`
})
export class DisabledOptionExampleComponent {
  disabledOptionValue: string[] = [];
  
  disabledOptions = [
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            {
              value: 'xihu',
              label: '西湖'
            },
            {
              value: 'xiasha',
              label: '下沙',
              disabled: true  // 禁用特定选项
            }
          ]
        },
        {
          value: 'ningbo',
          label: '宁波',
          disabled: true,  // 禁用整个节点及其子节点
          children: [
            {
              value: 'jiangbei',
              label: '江北'
            }
          ]
        }
      ]
    }
  ];
  
  getDisplayText(values: string[]): string {
    if (!values || values.length === 0) {
      return '';
    }
    return values.join(' / ');
  }
}
  `;
  
  searchSource = `
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-search-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <lib-cascader
      [(ngModel)]="searchSelected"
      [cascaderOptions]="largeOptions"
      [cascaderShowSearch]="true"
      [cascaderPlaceholder]="'支持搜索的级联选择框'">
    </lib-cascader>
    <div *ngIf="searchSelected && searchSelected.length" class="example-value">
      当前选择: {{ getDisplayText(searchSelected) }}
    </div>
  \`
})
export class SearchExampleComponent implements OnInit {
  searchSelected: string[] = [];
  largeOptions: any[] = [];
  
  ngOnInit(): void {
    this.initLargeOptions();
  }
  
  initLargeOptions() {
    // 初始化大量选项用于演示搜索功能
    const provinces = ['浙江', '江苏', '安徽', '河南', '山东'];
    
    this.largeOptions = provinces.map(province => {
      const cities = [];
      for (let i = 1; i <= 5; i++) {
        const districts = [];
        for (let j = 1; j <= 3; j++) {
          districts.push({
            value: \`\${province}-city\${i}-district\${j}\`,
            label: \`\${province}市\${i}区\${j}\`
          });
        }
        
        cities.push({
          value: \`\${province}-city\${i}\`,
          label: \`\${province}市\${i}\`,
          children: districts
        });
      }
      
      return {
        value: province,
        label: province,
        children: cities
      };
    });
  }
  
  getDisplayText(values: string[]): string {
    if (!values || values.length === 0) {
      return '';
    }
    return values.join(' / ');
  }
}
  `;
  
  customFieldSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-custom-field-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <lib-cascader
      [(ngModel)]="customFieldValue"
      [cascaderOptions]="customFieldOptions"
      [cascaderFieldNames]="customFields"
      [cascaderPlaceholder]="'自定义字段名'">
    </lib-cascader>
    <div *ngIf="customFieldValue && customFieldValue.length" class="example-value">
      当前选择: {{ getDisplayText(customFieldValue) }}
    </div>
  \`
})
export class CustomFieldExampleComponent {
  customFieldValue: string[] = [];
  
  // 使用自定义字段名的数据
  customFieldOptions = [
    {
      id: 'zhejiang',
      name: '浙江',
      items: [
        {
          id: 'hangzhou',
          name: '杭州',
          items: [
            {
              id: 'xihu',
              name: '西湖'
            }
          ]
        }
      ]
    }
  ];
  
  // 自定义字段映射
  customFields = {
    label: 'name',
    value: 'id',
    children: 'items'
  };
  
  getDisplayText(values: string[]): string {
    if (!values || values.length === 0) {
      return '';
    }
    return values.join(' / ');
  }
}
  `;
  
  optionSelectFnSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-option-select-fn-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <lib-cascader
      [(ngModel)]="optionSelectFnValue"
      [cascaderOptions]="options"
      [cascaderOptionSelectFn]="customSelectFunction"
      [cascaderPlaceholder]="'自定义选择函数'">
    </lib-cascader>
    <div *ngIf="optionSelectFnValue && optionSelectFnValue.length" class="example-value">
      当前选择: {{ getDisplayText(optionSelectFnValue) }}
    </div>
    <div class="tip">示例中不允许选择label中包含西湖的选项</div>
  \`
})
export class OptionSelectFnExampleComponent {
  optionSelectFnValue: string[] = [];
  
  options = [
    // 级联选择器选项数据...
  ];
  
  // 自定义选择函数 - 不允许选择包含"西湖"的选项
  customSelectFunction = (option: any) => {
    return !option.label.includes('西湖');
  };
  
  getDisplayText(values: string[]): string {
    if (!values || values.length === 0) {
      return '';
    }
    return values.join(' / ');
  }
}
  `;
  
  disableCheckboxSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-disable-checkbox-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <lib-cascader
      [(ngModel)]="disableCheckboxValue"
      [cascaderOptions]="disableCheckboxOptions"
      [cascaderIsMultiple]="true"
      [cascaderPlaceholder]="'部分选项禁用复选框'">
    </lib-cascader>
    <div *ngIf="disableCheckboxValue && disableCheckboxValue.length > 0" class="example-value">
      当前选择: {{ disableCheckboxValue.join(', ') }}
    </div>
  \`
})
export class DisableCheckboxExampleComponent {
  disableCheckboxValue: string[] = [];
  
  disableCheckboxOptions = [
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            {
              value: 'xihu',
              label: '西湖'
            },
            {
              value: 'xiasha',
              label: '下沙',
              disableCheckbox: true  // 禁用复选框但可选择
            }
          ]
        }
      ]
    }
  ];
}
  `;
  
  customTemplateSource = `
import { Component } from '@angular/core';
import { FormsModule, CommonModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-custom-template-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule, CommonModule],
  template: \`
    <lib-cascader
      [(ngModel)]="customTemplateValue"
      [cascaderOptions]="customOptions"
      [cascaderOptionTemplate]="customOptionTpl"
      [cascaderOptionLabelTemplate]="customOptionLabelTpl"
      [cascaderPlaceholder]="'自定义选项显示内容'">
    </lib-cascader>
    
    <ng-template #customOptionTpl let-option>
      <div class="custom-option">
        <i class="bi" [ngClass]="option.icon"></i>
        <span>{{option.label}}</span>
        <span class="option-desc" *ngIf="option.description">{{option.description}}</span>
      </div>
    </ng-template>

    <ng-template #customOptionLabelTpl let-value let-labels="labels">
      <span>自定义-{{ labels.join(' / ') }}-自定义</span>
    </ng-template>
    
    <div *ngIf="customTemplateValue && customTemplateValue.length" class="example-value">
      当前选择: {{ getDisplayText(customTemplateValue) }}
    </div>
  \`,
  styles: [\`
    .custom-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .option-desc {
      font-size: 12px;
      color: #888;
      margin-left: 8px;
    }
  \`]
})
export class CustomTemplateExampleComponent {
  customTemplateValue: string[] = [];
  
  customOptions = [
    {
      value: 'food',
      label: '食品',
      icon: 'bi-egg-fried',
      children: [
        {
          value: 'fruit',
          label: '水果',
          icon: 'bi-apple',
          children: [
            {
              value: 'apple',
              label: '苹果',
              icon: 'bi-apple',
              description: '每天一苹果，医生远离我'
            }
          ]
        }
      ]
    }
  ];
  
  getDisplayText(values: string[]): string {
    if (!values || values.length === 0) {
      return '';
    }
    return values.join(' / ');
  }
}
  `;
  
  statusSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-status-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <div class="status-container">
      <lib-cascader
        [(ngModel)]="statusValues.default"
        [cascaderOptions]="options"
        [cascaderPlaceholder]="'默认状态'">
      </lib-cascader>
      
      <lib-cascader
        [(ngModel)]="statusValues.error"
        [cascaderStatus]="'error'"
        [cascaderOptions]="options"
        [cascaderPlaceholder]="'错误状态'">
      </lib-cascader>
      
      <lib-cascader
        [(ngModel)]="statusValues.warning"
        [cascaderStatus]="'warning'"
        [cascaderOptions]="options"
        [cascaderPlaceholder]="'警告状态'">
      </lib-cascader>
    </div>
  \`,
  styles: ['.status-container { display: flex; flex-direction: column; gap: 16px; }']
})
export class StatusExampleComponent {
  statusValues = {
    default: [],
    error: [],
    warning: []
  };
  
  options = [
    // 级联选择器选项数据...
  ];
}
  `;
  
  borderlessSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-borderless-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <div class="borderless-container">
      <lib-cascader
        [cascaderBorderless]="true"
        [(ngModel)]="borderlessValue"
        [cascaderOptions]="options"
        [cascaderPlaceholder]="'无边框级联选择框'">
      </lib-cascader>
    </div>
  \`,
  styles: ['.borderless-container { padding: 16px; background-color: #f0f2f5; }']
})
export class BorderlessExampleComponent {
  borderlessValue: string[] = [];
  
  options = [
    // 级联选择器选项数据...
  ];
}
  `;
  
  disabledSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CascaderComponent } from '@project';

@Component({
  selector: 'app-disabled-example',
  standalone: true,
  imports: [CascaderComponent, FormsModule],
  template: \`
    <lib-cascader
      [(ngModel)]="disabledValue"
      [cascaderOptions]="options"
      [cascaderDisabled]="true"
      [cascaderPlaceholder]="'禁用状态的级联选择框'">
    </lib-cascader>
  \`
})
export class DisabledExampleComponent {
  disabledValue: string[] = [];
  
  options = [
    // 级联选择器选项数据...
  ];
}
  `;
}
