console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");
// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );

// currentLink?.classList.add("active");

let pages = [
  { url: "./", title: "Home" },
  { url: "projects", title: "Projects" },
  { url: "contact", title: "Contact" },
  { url: "resume", title: "Resume" },
  { url: "https://github.com/zhengsophia", title: "GitHub" },
];

// let nav = document.createElement("nav");
// document.body.prepend(nav);

// for (let p of pages) {
//   let url = p.url;
//   // if (!ARE_WE_HOME && !url.startsWith("http")) {
//   //   url = "../" + url;
//   // }
//   let title = p.title;
//   //   nav.insertAdjacentHTML("beforeend", `<a href="${url}">${title}</a>`);
//   let a = document.createElement("a");
//   a.href = url;
//   a.textContent = title;
//   if (a.host === location.host && a.pathname === location.pathname) {
//     a.classList.add("current");
//   }
//   if (a.host !== location.host) {
//     a.target = "_blank";
//   }
//   nav.append(a);
// }

// document.body.insertAdjacentHTML(
//   "afterbegin",
//   `
// 	<label class="color-scheme">
// 		Theme:
// 		<select>
// 			<option value="light dark">Auto</option>
// 			<option value="light">Light</option>
// 			<option value="dark">Dark</option>
// 		</select>
// 	</label>`
// );

// let select = document.querySelector(".color-scheme select");

// if ("colorScheme" in localStorage) {
//   document.documentElement.style.setProperty(
//     "color-scheme",
//     localStorage.colorScheme
//   );
//   select.value = localStorage.colorScheme;
// }

// select.addEventListener("input", (event) => {
//   const selectedScheme = event.target.value;
//   localStorage.colorScheme = selectedScheme;
//   document.documentElement.style.setProperty("color-scheme", selectedScheme);
//   console.log("color scheme changed to", event.target.value);
// });
