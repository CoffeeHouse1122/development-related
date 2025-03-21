import $ from "jquery";

function gtagEvent(id) {
  console.log(id);
  gtag("event", id, {
    method: "Google",
    event_category: id,
    event_action: id,
    event_label: id,
  });
}

export function gaInit() {
  // $(document).on("click", ".topbar-as", function () {
  //   gtagEvent("Store-ios");
  // });
}

