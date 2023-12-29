import {
  $Component
} from "../../enhance";
import $my from "../../$my";
$Component({
  options: {
    // 开启外部样式类功能
    externalClasses: true,
    "virtualHost":false
  },
  externalClasses: ['class'],
  data: {
    avatar: "",//头像
    nickName: "",//名字
    country: "",//国家
    province: "",//省份
    city: "",//城市
    Defaultimage:"https://ts2.cn.mm.bing.net/th?id=OIP-C.eSpAhJ8i75zSrfa1cacOQgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
    default:true,
    language:"",
    languages:{
      "zh-Hans":"简体中文",
      "en":"英文",
      "zh-HK":"繁体中文-香港",
      "zh-Hant":"繁体中文-台湾"
   }
  },
  properties: {
    type: {
      type: String,
      value: "blank"
    },
    defaultText: {
      type: String
    },
    defaultAvatar: {
      type: String
    }
  },
  // didMount() {
  //   this.getUserInfo()
  // },
  lifetimes: {
    attached(){
      this.getUserInfo()
    }
  },
  methods: {
    getUserInfo() {
      return new Promise(async (resolve, reject) => {
        try {
          const [locationRes, userInfoRes, correctness] = await Promise.all([
            this.getLocation(),
            this.getAuthUserInfo(),
            this.validateImageLink(this.data.defaultAvatar)
          ]);
          const { country, province, city } = locationRes
          const { avatar, nickName } = userInfoRes;
          if (avatar.length === 0 ) {//用户头像为空时
            if(correctness){//传过来的图片正确
              this.setData({
                avatar: this.data.defaultAvatar
              })
            }
            else{//传过来的图片不正确,
               if(this.data.defaultText!="blank")//传过来的图片不正确,有数据为空时的默认文案
               {
                this.setData({
                  default:false
                })
               }
               else{
                this.setData({//没有图片，没有默认文案，使用默认图片
                  avatar: this.data.Defaultimage
                })
               }
            }

          }
          else {
              this.setData({
                avatar
              })
          }
          this.setData({ 
            country:country||this.data.defaultText, 
            province:province||this.data.defaultText, 
            city:city||this.data.defaultText,
            nickName:nickName||this.data.defaultText,
            language:this.data.languages[my.env.language]||this.data.defaultText
          }),

          // 处理头像数据或其他逻辑

          resolve();
        } catch (error) {
          // 错误处理
          reject(error);
        }
      });

    },
    getLocation() {
      return new Promise((resolve, reject) => {
        $my.getLocation({
          type: 1,
          success: res => resolve(res),
          fail: error => reject(error)
        });
      });
    },
    getAuthUserInfo() {
      return new Promise((resolve, reject) => {
        $my.getAuthUserInfo({
          success: res => resolve(res),
          fail: error => reject(error)
        });
      });
    },
    validateImageLink(imgurl) {
      return new Promise((resolve, reject) => {
        $my.getImageInfo({
          src: imgurl,
          success: function (res) {
            if (res.width > 0 && res.height > 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          fail: function () {
            console.error("获取图片信息失败,请检查图片路径")
            resolve(false);
          }
        });
      });
    }

  }
});