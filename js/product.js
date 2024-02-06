// Bootstrap Modal 放全域設定
let productModal = null;
let delProductModal = null;

// Vue
const app = Vue.createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "cj-project",
      products: [],
      // 預期開啟 Modal 時會代入的資料
      tempProduct: {
        // 儲存小圖
        imagesUrl: []
      },
      // 用於判斷當前 Modal 是新增或編輯 Modal
      isNew: false
    };
  },
  methods: {
    // #1 API: 確認使用者權限
    checkLogin() {
      axios.post(`${this.apiUrl}/api/user/check`)
        .then((res) => {
          this.getProduct();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "login.html";
        });
    },
    // #2 API: 取得所有產品資訊
    getProduct() {
      axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.messaage);
        });
    },
    // #3 Modal: 判斷要開啟哪一個 Modal : 新增、編輯、刪除
    // item 代表的是當前點擊的產品資料
    openModal(status, item) {
      if (status === "new") {
        // 新增產品
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        this.productModal.show();
      } else if (status === "edit") {
        // 編輯產品
        this.tempProduct = { ...item };
        this.isNew = false;
        this.productModal.show();
      } else if (status === "delete") {
        // 刪除產品
        this.tempProduct = { ...item };
        this.isNew = false;
        this.delProductModal.show();
      }
    },
    // #4 API: 新增/編輯 產品資料 ; productModal內的"確認"按鈕
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      let http = "put";

      // 透過 if 判斷 isNew 的值，得知當前開啟的是新增還是編輯 Modal，再動態調整這兩個變數內容
      if (this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        http = "post";
      }

      axios[http](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          // 利用 hide 方法關閉 Modal
          this.productModal.hide();
          // 重新取得所有產品資料，完成產品更新
          this.getProduct();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // #5 API: delProductModal內的"確認刪除"按鈕
    delProduct() {
      // 刪除 API 需要取得對應產品 id 才能刪除，先前在 openModal 函式已經寫好，開啟刪除 Modal 時，會將當前產品資料傳入 tempProduct，所以可以直接使用 this.tempProduct.id 取得該產品 id，完成刪除產品功能
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url)
        .then((res) => {
          alert(res.data.message);
          this.delProductModal.hide();
          this.getProduct();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    }
  },
  // #1 Token 設定
  // 取得 Token（Token 僅需要設定一次）
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // 預設把 token 加入 headers 內
    axios.defaults.headers.common["Authorization"] = token;

    // #2 預設驗證登入
    this.checkLogin();

    // #3 modal實例化
    this.productModal = new bootstrap.Modal(this.$refs.productModal);
    this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal);
  }
});
app.mount("#app");

