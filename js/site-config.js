// Single source of truth for organization info
var SiteConfig = {
  stripe: {
    publishableKey: 'pk_live_51SpIpFF9vTsVWggHveXKARB1mtjqbIrvmcdHg3JhMX1txzask5Nj755Z2JmCqbTra7pmjflkr2W5WcDMVtig4W3L00Hc3KAFO7'
  },

  org: {
    name: 'Our Kind Kitchen',
    type: '501(c)(3) Non-Profit',
    ein: '99-3415090',
    street: '1237 Edgewood Rd.',
    city: 'Yardley',
    state: 'PA',
    zip: '19067',
    serviceArea: 'Serving the greater Yardley area',
    tagline: 'Serving the greater Yardley community with compassion and care.',
    purpose: 'Providing gourmet home-cooked meals to neighbors in need'
  },

  get fullAddress() {
    return this.org.street + ', ' + this.org.city + ', ' + this.org.state + ' ' + this.org.zip;
  },

  get locationBlock() {
    return this.org.street + '\n' + this.org.city + ', ' + this.org.state + ' ' + this.org.zip;
  }
};
