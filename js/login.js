const app = Vue.createApp({
  data() {
    return {
      // config 設定
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      user: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      if (!this.user.username || !this.user.password) {
        alert("請輸入信箱及密碼!");
        return;
      } else {
        axios.post(`${this.apiUrl}/admin/signin`, this.user)
          .then((res) => {
            // 將 token 和 unix timestamp 存起來
            const { token, expired } = res.data;
            // expires 設置有效時間
            document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
            // 跳轉頁面
            window.location = "product.html";
          })
          .catch((err) => {
            alert(err.response.data.message);
            // 清空input欄位
            this.user.username = "";
            this.user.password = "";
          });
      }
    }
  }
});
app.mount("#app");

