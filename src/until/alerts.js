module.exports = {
    hideAlert: function () {
        const el = document.querySelector(".alert");
        if (el) {
          el.parentElement.removeChild(el);
        }
    },
      
    showAlert: function(type, msg, time = 5) {
        // hideAlert();
        const markup = `<div class="alert alert--${type}">${msg}</div>`;
        document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
        window.setTimeout(hideAlert, time * 1000);
    },
      
}