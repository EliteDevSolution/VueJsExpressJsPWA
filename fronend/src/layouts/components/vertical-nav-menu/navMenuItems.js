export default [
  {
    url: "/",
    i18n: "home.title",
    slug: "home",
    icon: "HomeIcon",
  },
  {
    url: "/campaigns",
    i18n: "campaigns.title",
    slug: "campaigins",
    icon: "MailIcon",
  },
  {
    url: "/users",
    i18n: "users.title",
    slug: "users",
    icon: "UserIcon",
    permission: ["SuperAdmin"],
  }
]
