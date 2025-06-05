import { ChangeDetectorRef, Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export interface svgData {
  svgHtml: string,
  tplWidth: number,
  tplHeight: number,
  photos: Array<any>,
  elements: Array<any>
}

@Component({
  selector: 'lib-generate-png',
  standalone: true,
  imports: [

  ],
  templateUrl: './generate-png.component.html',
  styleUrl: './generate-png.component.less'
})
export class GeneratePngComponent {
  // @Input() data?: svgData;
  // @Output() dataChange = new EventEmitter<svgData>();

  // constructor(private cdr: ChangeDetectorRef, private message: NzMessageService, private router: Router, private activatedRoute: ActivatedRoute,) { }
  // honor_name = ''
  // variables: any = [
  //   { label: "学生姓名", value: "student_name" },
  //   { label: "老师姓名", value: "teacher_name" },
  //   { label: "比赛名称", value: "contest_name" },
  //   { label: "奖项等级", value: "reward_type" },
  //   { label: "证书时间", value: "times" }
  // ]
  // isAdding = true;
  // isChangeing = false;
  // elements: Array<any> = [];
  // selectedElementId = '';
  // //文字添加的基本字段
  // maxmunTextCount = 5;
  // variable = '';
  // label = '';
  // fontsize = '32';
  // widthindant = '0';
  // fontFamily = 'Microsoft YaHei, YaHei, sans-serif';
  // fontColor = '#000000';
  // fontWeight = 20;
  // content = '';
  // dragElementId = '';
  // x = 10;
  // y = 10;
  // chineseFonts = [
  //   { label: "宋体", value: "SimSun, Song, STSong, serif" },
  //   { label: "黑体", value: "SimHei, Hei, STHeiTi, sans-serif" },
  //   { label: "微软雅黑", value: "Microsoft YaHei, YaHei, sans-serif" },
  //   { label: "仿宋", value: "FangSong, STFangSong, serif" },
  //   { label: "楷体", value: "KaiTi, STKaiti, serif" },
  //   { label: "隶书", value: "LiSu, STLiSu, serif" },
  //   { label: "幼圆", value: "YouYuan, STYuanti, sans-serif" },
  //   { label: "华文仿宋", value: "STFangsong, FangSong, serif" },
  //   { label: "华文宋体", value: "STSong, Song, serif" },
  //   { label: "华文黑体", value: "STHeiti, Hei, sans-serif" },
  //   { label: "华文楷体", value: "STKaiti, KaiTi, serif" },
  //   { label: "华文彩云", value: "STCaiyun, Caiyun, sans-serif" }
  // ];

  // //图片修改
  // pnum: Array<any> = [];
  // photoId = '';
  // photoX = 0;
  // photoY = 0;
  // photoWidth = 0;
  // photoHeight = 0;
  // nowPhotoIndex = 0;
  // isChangeingPhoto = false;
  // templatePhotoArray: any = [];
  // photoname = '';
  // photos: any = [];
  // tplwidth = 0;
  // tplheight = 0;
  // totalwidth = 0;
  // totalheight = 0;
  // switchValue = true;
  // editElementIndex = 0;
  // dragOriginPosition: any = {};
  // async ngOnInit(): Promise<void> {

  // }

  // ngOnChanges() {
  //   if (this.data) {
  //     this.initData(this.data);
  //   }
  // }

  // initData(data: any) {
  //   let box = document.getElementById('sss')!;
  //   box.innerHTML = data.svgHtml;
  //   this.tplwidth = data.tplwidth;
  //   this.totalwidth = data.tplwidth;
  //   this.totalheight = data.tplheight;
  //   this.tplheight = data.tplheight;
  //   this.photos = data.photos;
  //   this.elements = data.elements;
  // }

  // /**
  //  * 
  //  * @param event 添加模板背景图片
  //  */
  // addtplphoto(event: any) {
  //   const image = event.target.files[0];
  //   if (image.type !== 'image/png') {
  //     this.message.error("上传的文件类型有误,仅支持png");
  //   } else {
  //     this.getBackgroundPngWidthAndHeight(image);
  //   }
  // }

  // /**
  //  * 获取背景svg的宽高
  //  * @param image 上传的照片文件
  //  */
  // getBackgroundPngWidthAndHeight(image: any) {
  //   let reader = new FileReader();
  //   let box: any = document.getElementById('sss');
  //   reader.readAsDataURL(image);
  //   reader.onload = (result: any) => {
  //     const img = new Image(image);
  //     img.src = result.target?.result;
  //     img.onload = () => {
  //       let size = box.getBoundingClientRect();
  //       this.totalwidth = size.width;
  //       this.totalheight = size.height;
  //       this.tplheight = size.height;
  //       this.tplwidth = size.width;
  //       this.initTpl(result.target?.result);
  //     }
  //   };
  // }

  // /**
  //  * 修改每行最大文字数
  //  */
  // changeMaximumWordCount() {
  //   const text = document.getElementById(this.selectedElementId) as any;
  //   text.setAttributeNS(null, 'maxmunTextCount', this.maxmunTextCount.toString());
  //   if (this.maxmunTextCount == 0) {

  //   } else {
  //     if (this.content.length > this.maxmunTextCount) {
  //       for (let i = text.children.length - 1; i >= 0; i--) {
  //         text.removeChild(text.children.item(i)!)
  //       }
  //       let num = Math.ceil(this.content.length / this.maxmunTextCount)
  //       for (let i = 0; i < num; i++) {
  //         const svgns = "http://www.w3.org/2000/svg";
  //         const tspan = document.createElementNS(svgns, 'tspan');
  //         tspan.textContent = this.content.substring(i * this.maxmunTextCount, (i + 1) * this.maxmunTextCount);
  //         tspan.setAttributeNS(null, 'x', text.attributes.x.value);
  //         tspan.setAttributeNS(null, 'dy', '1.2em');
  //         text.appendChild(tspan);
  //       }
  //     } else {
  //       for (let i = text.children.length - 1; i >= 0; i--) {
  //         text.removeChild(text.children.item(i)!)
  //       }
  //       const svgns = "http://www.w3.org/2000/svg";
  //       const tspan = document.createElementNS(svgns, 'tspan');
  //       tspan.textContent = this.content;
  //       tspan.setAttributeNS(null, 'x', text.attributes.x.value);
  //       tspan.setAttributeNS(null, 'dy', '1.2em');
  //       text.appendChild(tspan);
  //     }
  //   }

  // }

  // // //对证书的文件进行修改的函数
  // // onChangex(event: any) {
  // //   const text = document.getElementById(this.selectedElementId)!
  // //   text.setAttributeNS(null, "x", (event * this.totalwidth / 100).toString())
  // //   for (let i = 0; i < text.children.length; i++) {
  // //     text.children.item(i)!.setAttributeNS(null, "x", (event * this.totalwidth / 100).toString())
  // //   }

  // // }

  // // onChangey(event: any) {
  // //   const text = document.getElementById(this.selectedElementId)!
  // //   text && text.setAttributeNS(null, "y", (event * this.totalheight / 100).toString())
  // // }

  // onChangeFontSize(event: any) {
  //   const text = document.getElementById(this.selectedElementId);
  //   text && text.setAttributeNS(null, "font-size", event);
  // }

  // onChangewidthindant(event: any) {
  //   const text = document.getElementById(this.selectedElementId);
  //   text && text.setAttributeNS(null, 'letter-spacing', event);
  // }

  // onChangeFontFamily(event: any) {
  //   const text = document.getElementById(this.selectedElementId);
  //   text && text.setAttributeNS(null, 'font-family', event);
  // }

  // onChangecolor(event: any) {
  //   const text = document.getElementById(this.selectedElementId);
  //   text && text.setAttributeNS(null, 'fill', event.color.toHexString());
  // }

  // onChangeFontWeight(event: any) {
  //   const text = document.getElementById(this.selectedElementId);
  //   text && text.setAttributeNS(null, 'font-weight', (event * 10).toString());
  // }

  // onChangecontent(event: any) {
  //   const text = document.getElementById(this.selectedElementId);
  //   text && this.changeText(text, event);
  // }

  // changeText(texts: any, event: any) {
  //   for (let i = texts.children.length - 1; i >= 0; i--) {
  //     texts.removeChild(texts.children.item(i));
  //   }
  //   if (event.length > this.maxmunTextCount) {
  //     let num = Math.ceil(event.length / this.maxmunTextCount);
  //     for (let i = 0; i < num; i++) {
  //       const svgns = "http://www.w3.org/2000/svg";
  //       const tspan = document.createElementNS(svgns, 'tspan');
  //       tspan.textContent = event.substring(i * this.maxmunTextCount, (i + 1) * this.maxmunTextCount);
  //       tspan.setAttributeNS(null, 'x', texts.attributes.x.value);
  //       tspan.setAttributeNS(null, 'dy', '1.2em');
  //       texts.appendChild(tspan);
  //     }
  //   } else {
  //     const svgns = "http://www.w3.org/2000/svg";
  //     const tspan = document.createElementNS(svgns, 'tspan');
  //     tspan.textContent = event;
  //     tspan.setAttributeNS(null, 'x', texts.attributes.x.value);
  //     tspan.setAttributeNS(null, 'dy', '1.2em');
  //     texts.appendChild(tspan);
  //   }
  // }

  // onChangeVariable(event: any) {
  //   const text = document.getElementById(this.selectedElementId)!
  //   text && text.setAttributeNS(null, 'class', this.variable);
  // }

  // number: Array<any> = [];

  // startEditText(elementIndex: number, elementId: any) {
  //   this.editElementIndex = elementIndex;
  //   this.selectedElementId = elementId;
  //   this.label = this.elements[elementIndex].label;
  //   this.fontsize = this.elements[elementIndex].font.size;
  //   this.widthindant = this.elements[elementIndex].font.space;
  //   this.fontFamily = this.elements[elementIndex].font.family;
  //   this.fontColor = this.elements[elementIndex].font.fontColor;
  //   this.fontWeight = this.elements[elementIndex].font.fontweight;
  //   this.content = this.elements[elementIndex].feild;
  //   this.variable = this.elements[elementIndex].variable;
  //   this.isAdding = false;
  //   this.isChangeing = true;
  // }

  // confirmEditText() {
  //   this.elements[this.editElementIndex].label = this.label;
  //   this.elements[this.editElementIndex].font.size = this.fontsize;
  //   this.elements[this.editElementIndex].font.space = this.widthindant;
  //   this.elements[this.editElementIndex].font.family = this.fontFamily;
  //   this.elements[this.editElementIndex].font.fontColor = this.fontColor;
  //   this.elements[this.editElementIndex].font.fontweight = this.fontWeight;
  //   this.elements[this.editElementIndex].feild = this.content;
  //   this.elements[this.editElementIndex].variable = this.variable;
  //   this.isAdding = true;
  //   this.isChangeing = false;
  //   this.selectedElementId = this.number[this.number.length - 1];
  //   this.resetFontConfig();
  // }

  // dragElement = (id: string) => {
  //   return () => {
  //     this.dragElementId = id;
  //     let box = document.getElementById('tplSvg');
  //     let element: any = document.getElementById(id);
  //     if (box && element) {
  //       box.onmousedown = (e) => {
  //         this.dragOriginPosition = {
  //           x: e.clientX - Number.parseInt(element.attributes.x.value),
  //           y: e.clientY - Number.parseInt(element.attributes.y.value)
  //         }
  //         box.onmousemove = (event) => {
  //           if (id !== this.dragElementId) {
  //             return;
  //           }
  //           let x = event.clientX - this.dragOriginPosition.x;
  //           let y = event.clientY - this.dragOriginPosition.y;
  //           element.setAttributeNS(null, "x", x);
  //           for (let child of element.children) {
  //             child.setAttributeNS(null, "x", x);
  //           }
  //           element.setAttributeNS(null, "y", y)
  //         }
  //       }
  //       box.onmouseup = () => {
  //         box.onmousemove = null;
  //         this.dragElementId = '';
  //         this.dragOriginPosition = null;
  //       }
  //     }
  //   }
  // }

  // //添加证书的文字
  // addEText() {
  //   if (this.label == '') {
  //     this.message.create('error', '标签不得为空')
  //   } else {
  //     this.elements.push({
  //       id: this.selectedElementId,
  //       label: this.label,
  //       font: {
  //         size: this.fontsize,
  //         space: this.widthindant,
  //         family: this.fontFamily,
  //         fontColor: this.fontColor,
  //         fontweight: this.fontWeight,
  //         max: this.maxmunTextCount
  //       },
  //       coordinate: {
  //         x: this.x,
  //         y: this.y
  //       },
  //       feild: this.content,
  //       variable: this.variable
  //     })
  //     const id = uuidv4();
  //     this.selectedElementId = id;
  //     this.number.push(this.selectedElementId);
  //     const svg = document.getElementById('tplSvg')!;
  //     const svgns = "http://www.w3.org/2000/svg";
  //     const text = document.createElementNS(svgns, 'text')!;
  //     text.setAttributeNS(null, 'id', this.selectedElementId);
  //     text.setAttributeNS(null, 'x', '100');
  //     text.setAttributeNS(null, 'y', '100');
  //     text.setAttributeNS(null, "font-size", "32");
  //     text.setAttributeNS(null, 'maxmunTextCount', this.maxmunTextCount.toString());
  //     text.onmousedown = this.dragElement(id);
  //     text.textContent = "";
  //     svg.appendChild(text);
  //     this.resetFontConfig();
  //   }
  // }

  // resetFontConfig() {
  //   this.maxmunTextCount = 5;
  //   this.label = '';
  //   this.fontsize = '32';
  //   this.widthindant = '0';
  //   this.fontFamily = 'Microsoft YaHei, YaHei, sans-serif';
  //   this.fontColor = '#000000';
  //   this.fontWeight = 20;
  //   this.content = '';
  //   this.x = 10;
  //   this.y = 10;
  //   this.variable = '';
  // }

  // initTpl(url: string) {
  //   const sss = document.getElementById('sss')!;
  //   const svgns = "http://www.w3.org/2000/svg";
  //   const svg = document.createElementNS(svgns, 'svg')!
  //   svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  //   svg.setAttributeNS(null, "width", this.tplwidth.toString());
  //   svg.setAttributeNS(null, "height", this.tplheight.toString());
  //   svg.setAttributeNS(null, "viewBox", "0 0 " + this.totalwidth + " " + this.totalheight);
  //   svg.setAttributeNS(null, "preserveAspectRatio", "none");
  //   svg.setAttributeNS(null, "id", "tplSvg");
  //   const image = document.createElementNS(svgns, 'image')!;
  //   image.setAttributeNS(null, 'href', url);
  //   image.setAttributeNS(null, 'x', '0');
  //   image.setAttributeNS(null, 'y', '0');
  //   svg.appendChild(image);
  //   const id = uuidv4();
  //   this.selectedElementId = id;
  //   const text = document.createElementNS(svgns, 'text')!;
  //   text.setAttributeNS(null, 'id', id);
  //   text.setAttributeNS(null, 'x', '100');
  //   text.setAttributeNS(null, 'y', '100');
  //   text.setAttributeNS(null, "font-size", "32");
  //   text.setAttributeNS(null, 'maxmunTextCount', this.maxmunTextCount.toString());
  //   text.onmousedown = this.dragElement(id);
  //   svg.appendChild(text);
  //   sss?.appendChild(svg);
  // }

  // //删除文字
  // deleteText(id: number) {
  //   const svgElement = document.getElementById("tplSvg")!;
  //   if (svgElement) {
  //     const item = document.getElementById(this.number[id])!;
  //     svgElement.removeChild(item);
  //     this.number.splice(id, 1);
  //     this.elements.splice(id, 1);
  //   }
  // }

  // onChangepx(event: any) {
  //   const text = document.getElementById(this.photoId.toString())!
  //   text && text.setAttributeNS(null, "x", (event * this.totalheight / 100).toString())
  // }

  // onChangepy(event: any) {
  //   const text = document.getElementById(this.photoId.toString())!
  //   text && text.setAttributeNS(null, "y", (event * this.totalheight / 100).toString())
  // }

  // onChangepw(event: any) {
  //   const text = document.getElementById(this.photoId.toString())!
  //   text && text.setAttributeNS(null, "width", (event * this.totalheight / 100).toString())
  // }

  // onChangeph(event: any) {
  //   const text = document.getElementById(this.photoId.toString())!
  //   text && text.setAttributeNS(null, "height", (event * this.totalheight / 100).toString())
  // }

  // //图片添加

  // uploadPhoto(event: any) {
  //   const image = event.target.files[0];
  //   if (image.type !== 'image/png') {
  //     this.message.error("上传的文件类型有误,仅支持png");
  //     return;
  //   }
  //   let reader = new FileReader();
  //   reader.readAsDataURL(image);
  //   reader.onload = (result: any) => {
  //     const img = new Image(image);
  //     img.src = result.target?.result;
  //     img.onload = () => {
  //       if (img) {
  //         const id = uuidv4();
  //         this.photoId = id;
  //         this.templatePhotoArray = [];
  //         this.templatePhotoArray.push(image);
  //         this.photoname = image.name;
  //         const svg = document.getElementById("tplSvg")!;
  //         const svgns = "http://www.w3.org/2000/svg";
  //         const svgImage = document.createElementNS(svgns, 'image');
  //         svgImage.setAttributeNS(null, 'href', result.target?.result);
  //         svgImage.setAttributeNS(null, 'id', this.photoId);
  //         svgImage.setAttributeNS(null, 'x', '100');
  //         svgImage.setAttributeNS(null, 'y', '100');
  //         svgImage.setAttributeNS(null, 'width', '300');
  //         svgImage.setAttributeNS(null, 'height', '300');
  //         svgImage.onmousedown = this.dragElement(id);
  //         svg.appendChild(svgImage);
  //         event.target.value = '';
  //       };
  //     }
  //   };
  // }


  // deletePhoto(id: number) {
  //   const svgElement = document.getElementById("tplSvg")!;
  //   const item = document.getElementById(this.photos[id].id)!;
  //   svgElement.removeChild(item);
  //   this.photos.splice(id, 1);
  // }

  // addphoto() {
  //   if (this.templatePhotoArray.length == 0) {
  //     this.message.create('error', '请添加图片');
  //     return;
  //   }
  //   this.photos.push({
  //     id: this.photoId,
  //     x: this.photoX,
  //     y: this.photoY,
  //     width: this.photoWidth,
  //     height: this.photoHeight,
  //     name: this.photoname
  //   })
  //   this.resetpho();
  //   this.templatePhotoArray = [];
  // }

  // startEditPhoto(i: number) {
  //   this.nowPhotoIndex = i;
  //   this.isChangeingPhoto = true;
  //   this.photoId = this.photos[i].id;
  //   this.photoX = this.photos[i].x;
  //   this.photoY = this.photos[i].y;
  //   this.photoWidth = this.photos[i].width;
  //   this.photoHeight = this.photos[i].height;
  // }

  // confirmEditPhoto() {
  //   this.isChangeingPhoto = false;
  //   this.photos[this.nowPhotoIndex].x = this.photoX;
  //   this.photos[this.nowPhotoIndex].y = this.photoY;
  //   this.photos[this.nowPhotoIndex].width = this.photoWidth;
  //   this.photos[this.nowPhotoIndex].height = this.photoHeight;
  //   this.resetpho()
  // }

  // resetpho() {
  //   this.photoX = 0;
  //   this.photoY = 0;
  //   this.photoWidth = 0;
  //   this.photoHeight = 0;
  // }

  // //模板获得
  // post() {
  //   const svgElement = document.getElementById("tplSvg")!;
  //   const svgXml = svgElement.outerHTML;
  //   const infor = {
  //     tplwidth: this.totalwidth,
  //     tplheight: this.totalheight,
  //   }
  //   const res: any = {
  //     svgHtml: svgXml,
  //     infor,
  //     photos: this.photos,
  //     elements: this.elements
  //   };
  //   console.log(res);
  //   this.dataChange.emit(res);
  // }
}
