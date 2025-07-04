import { Component, Injectable, Type } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { timer } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * 使用防抖函数包装异步函数
   * @param fn 需要防抖的函数
   * @param delay 延迟时间（毫秒）
   * @returns 包装后的防抖函数，返回 Promise
   */
  debounce<T>(fn: (...args: any[]) => Promise<T>, delay: number = 300): (...args: any[]) => Promise<T> {
    let timeout: any = null;
    let requestId: number = 0;
    return function (...args: any[]): Promise<T> {
      return new Promise((resolve, reject) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        const currentRequestId = ++requestId;
        timeout = setTimeout(() => {
          fn(...args)
            .then((result: T) => {
              if (currentRequestId === requestId) {
                resolve(result);
              }
            })
            .catch((error) => {
              if (currentRequestId === requestId) {
                reject(error);
              }
            });
        }, delay);
      });
    };
  }

  /**
   * 创建记忆化函数，用于缓存相同输入的计算结果
   * @param fn 需要记忆化的函数
   * @returns 记忆化后的函数
   */
  memoize<T>(fn: (...args: any[]) => T): (...args: any[]) => T {
    const cache = new Map();

    return function (...args: any[]): T {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  }

  /**
   * 获取对象的所有键
   * @param obj 任意对象
   * @returns 对象的键数组
   */
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  /**
   * 通用的追踪函数，用于 ngFor 的 trackBy
   * @param index 索引
   * @param item 项目
   * @returns 追踪标识符
   */
  trackByFn(index: number, item: any): any {
    return index;
  }

  /**
   * 延迟执行函数
   * @param callback 回调函数
   * @param delay 延迟时间（毫秒）
   * @returns 定时器标识符
   */
  delayExecution(callback: () => void, delay: number = 0): void {
    let timer = setTimeout(() => {
      callback();
      clearTimeout(timer);
    }, delay);
  }

  /**
   * 判断是否为 TemplateRef 类型
   * @param value 需要判断的值
   * @returns 是否为 TemplateRef 类型
   */
  isTemplateRef(value: any): boolean {
    return value instanceof TemplateRef;
  }

  /**
   * 通用遍历函数，用于对所有节点执行操作
   * @param nodes 节点
   * @param callback 回调函数
   */
  public traverseAllNodes(nodes: any[], callback: (node: any) => void): void {
    nodes && nodes.length && nodes.forEach(node => {
      callback(node);
      if (node.children && node.children.length) {
        this.traverseAllNodes(node.children, callback);
      }
    });
  }

  /**
   * 获取节点的所有父节点
   * @param node 节点
   * @param AllNodes 所有节点
   * @returns 父节点
   */
  public getParentNodes(node: any, AllNodes: any[]): any[] {
    const parents: any[] = [];
    const findParents = (nodes: any[], targetKey: string): boolean => {
      for (const current of nodes) {
        if (current.key === targetKey) {
          return true;
        }
        if (current.children) {
          if (findParents(current.children, targetKey)) {
            parents.unshift(current);
            return true;
          }
        }
      }
      return false;
    };
    findParents(AllNodes, node.key);
    return parents;
  }


  /**
   * 生成随机id
   */
  public getRandomId(): string {
    return `node_${new Date().getTime().toString().substring(5)}${Math.round(Math.random() * 9000 + 1000)}`;
  }

  /**
   * 生成UUID
   */
  public getUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * 判断是否为组件
   * @param value 需要判断的值
   * @returns 是否为组件
   */
  isComponent(value: any): boolean {
    return value instanceof Type;
  }

  /**
   * 判断是否为模板
   * @param value 需要判断的值
   * @returns 是否为模板
   */
  isTemplate(value: any): boolean {
    return value instanceof TemplateRef;
  }

  /**
   * 获取字符串
   * @param value 值
   * @returns 字符串
   */
  getString(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number') {
      return value.toString() + 'px';
    }
    return '';
  }

  /**
   * 创建圆角连接线
   * @param {Object} options - 配置参数
   * @param {string} options.color - 线条颜色
   * @param {number} options.width - 线条宽度(px)
   * @param {number} options.radius - 拐角弧度(px)
   * @param {Array} options.path - 路径点数组，格式为[[x1,y1], [x2,y2], ...]
   * @returns {SVGElement} - 创建的SVG元素
   */
  public createRoundedLine(options: any) {
    const {
      color = '#32d8e7',
      width = 2,
      radius = 20,
      path = [],
      left = 0,
      top = 0,
    } = options;
    // 创建SVG元素
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = `${top}px`;
    svg.style.left = `${left}px`;
    svg.style.overflow = 'visible';
    svg.style.pointerEvents = 'none';
    // 创建路径
    const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svgPath.setAttribute('fill', 'none');
    svgPath.setAttribute('stroke', color);
    svgPath.setAttribute('stroke-width', width);
    // 构建路径数据
    let pathData = `M ${path[0][0]},${path[0][1]}`;
    for (let i = 1; i < path.length; i++) {
      const current = path[i];
      const prev = path[i - 1];
      // 如果是最后一个点或只有两个点，直接连接
      if (i === path.length - 1 || path.length === 2) {
        pathData += ` L ${current[0]},${current[1]}`;
        continue;
      }
      const next = path[i + 1];
      // 计算当前点到上一个点的方向
      const dirFromPrev = [current[0] - prev[0], current[1] - prev[1]];
      // 计算下一个点到当前点的方向
      const dirToNext = [next[0] - current[0], next[1] - current[1]];

      // 判断是否需要创建圆角
      // 当方向发生变化时创建圆角
      if ((dirFromPrev[0] !== 0 && dirToNext[1] !== 0) ||
        (dirFromPrev[1] !== 0 && dirToNext[0] !== 0)) {
        // 计算进入和离开圆角的点
        const enterRadius = [
          current[0] - Math.sign(dirFromPrev[0]) * Math.min(Math.abs(dirFromPrev[0]), radius),
          current[1] - Math.sign(dirFromPrev[1]) * Math.min(Math.abs(dirFromPrev[1]), radius)
        ];
        const exitRadius = [
          current[0] + Math.sign(dirToNext[0]) * Math.min(Math.abs(dirToNext[0]), radius),
          current[1] + Math.sign(dirToNext[1]) * Math.min(Math.abs(dirToNext[1]), radius)
        ];
        // 添加到路径：直线到进入点，然后二次贝塞尔曲线到离开点
        pathData += ` L ${enterRadius[0]},${enterRadius[1]}`;
        pathData += ` Q ${current[0]},${current[1]} ${exitRadius[0]},${exitRadius[1]}`;
        // 更新当前点到圆角出口点
        path[i] = exitRadius;
      } else {
        // 如果没有转弯，直接连接
        pathData += ` L ${current[0]},${current[1]}`;
      }
    }
    svgPath.setAttribute('d', pathData);
    svg.appendChild(svgPath);
    return svg;
  }

  /**
   * 扁平化树节点
   * @param nodes 节点
   * @param callback 回调函数
   * @param nowLevel 当前层级
   * @param parentNode 父节点
   */
  public flattenTreeNodes(nodes: any[], callback: (node: any, nowLevel: number, parentNode: any, index: number) => void, nowLevel: number = 0, parentNode: any = null): void {
    nodes.forEach((node, index) => {
      callback(node, nowLevel, parentNode, index);
      if (node?.children && node?.children?.length) {
        this.flattenTreeNodes(node.children, callback, nowLevel + 1, node);
      }
    });
  }

  /**
   * 获取范围随机数
   * @param min 最小值
   * @param max 最大值
   * @returns 随机数
   */
  public getRange(min: number, max: number): Array<number> {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }

  /**
  * 添加拖拽占位元素
  * @param element 被拖拽的DOM元素
  */
  public addDragPlaceholderElement(element: HTMLElement): void {
    timer(100).subscribe(() => {
      let newElement = document.createElement('div');
      newElement.innerHTML = element.outerHTML;
      newElement.id = 'dragElement';
      // 设置样式
      newElement.style.position = 'absolute';
      newElement.style.width = element.offsetWidth + 'px';
      newElement.style.height = element.offsetHeight + 'px';
      newElement.style.left = element.getBoundingClientRect().left + 'px';
      newElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      newElement.style.top = element.getBoundingClientRect().top + 'px';
      newElement.style.zIndex = '1000';
      newElement.style.pointerEvents = 'none';
      document.body.appendChild(newElement);
    })
  }
}
