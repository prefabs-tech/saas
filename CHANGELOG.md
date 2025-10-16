## [0.27.2](https://github.com/prefabs-tech/saas/compare/v0.27.1...v0.27.2) (2025-10-16)


### Features

* skip app domain check for config with subdomains disabled ([#165](https://github.com/prefabs-tech/saas/issues/165)) ([3fc4272](https://github.com/prefabs-tech/saas/commit/3fc4272985752e052466be3633325c6e7470c613))



## [0.27.1](https://github.com/prefabs-tech/saas/compare/v0.27.0...v0.27.1) (2025-10-10)



# [0.27.0](https://github.com/prefabs-tech/saas/compare/v0.26.0...v0.27.0) (2025-09-26)


### Bug Fixes

* **account-form:** fix the creation of individual type account when the entity is of type individual ([467f6b1](https://github.com/prefabs-tech/saas/commit/467f6b1fea0bf3d5262fb89065915d7960734760))
* **react/accounts-table:** persist table states ([f85c3c9](https://github.com/prefabs-tech/saas/commit/f85c3c9781fbea66203c44a5ed0814ebd9560fea))
* **react/multiple-sessions:** clear persisted account id if not found in user accounts ([3df023b](https://github.com/prefabs-tech/saas/commit/3df023bb0cec5a29d915fa04ff6fb4281e199a0c))
* **react/signup:** open user app on same window after signup ([885438b](https://github.com/prefabs-tech/saas/commit/885438bcf754fdc4ce446ca9f34ddb1dbe49741e))


### Features

* use global account error ([6897990](https://github.com/prefabs-tech/saas/commit/6897990a88ff543742c8094e1120a09672f353fd))
* **vue-main-app:** implement injection of additional tabs ([9845854](https://github.com/prefabs-tech/saas/commit/9845854c30ae688f02d587558e64aca09d8b6a0d))
* **vue/account-info:** show badge of account type ([499bdc5](https://github.com/prefabs-tech/saas/commit/499bdc574140eb8f2985317354a27e50ea487a73))
* **vue/account-view:** show the account type as a badge alongside the account name ([7a88c88](https://github.com/prefabs-tech/saas/commit/7a88c8868cf32f758f8cdd167dbb307413d9f091))
* **vue/accounts:** make account table dynamic based on entity type ([9dab3fe](https://github.com/prefabs-tech/saas/commit/9dab3fe7e8eb0ff043a1c7f1964c83c950599908))
* **vue/error-handling:** show error message when no account found error is thrown ([cc865d9](https://github.com/prefabs-tech/saas/commit/cc865d95c3aa8e52cdc17d91e1e3b8330682801e))
* **vue/tables:** set persist-state prop to true for accounts, invitations and users table ([873b5e6](https://github.com/prefabs-tech/saas/commit/873b5e678c66fd16dbdcab8671735f261a88ef04))
* **vue/translation:** add translation for type header for accounts table ([9f647ac](https://github.com/prefabs-tech/saas/commit/9f647ac536c0cbc9a8d62c3832c24363d781108b))
* **vue:** enhance SimpleAccountError component ([4e0eb4b](https://github.com/prefabs-tech/saas/commit/4e0eb4b899471f7806aa6fb0e8bfb7042bd144ee))
* **vue:** introduce NotFoundMessage component and replace SimpleAccountError usage ([dda5648](https://github.com/prefabs-tech/saas/commit/dda564809ce1ed6a37334be6e9213a233f3d7b77))
* **vue:** refactor AccountSettings view and update import paths ([903553f](https://github.com/prefabs-tech/saas/commit/903553f2beb63f8c2cc20e230a1df4c6b661fd0e))



# [0.26.0](https://github.com/prefabs-tech/saas/compare/v0.25.0...v0.26.0) (2025-09-04)


### Bug Fixes

* **react/account-show:** add page toolbar actions ([39b81a4](https://github.com/prefabs-tech/saas/commit/39b81a4d15c3f3ddaba6887f59aba17c1464a732))
* **vue/account-card:** fix the prop value for severity for BadgeComponent in AccountCard ([40fee03](https://github.com/prefabs-tech/saas/commit/40fee0368b8cd020a4b5feac76f5d95b7308a26a))


### Features

* **form-actions:** support form actions aligment customization ([dd7bd01](https://github.com/prefabs-tech/saas/commit/dd7bd01e9c1ea0937a61a8c53974d72241b71677))
* implement accounts page for main app ([717c106](https://github.com/prefabs-tech/saas/commit/717c1062e450de68722eb42537b2c4cfe3a7b9af))
* make the account settings page reactive to the change of active account ([cf71eb9](https://github.com/prefabs-tech/saas/commit/cf71eb9bb2af0acb63bd30f470558f165ab92d7a))
* **react/account-show:** allow to customize account settings page ([301d35d](https://github.com/prefabs-tech/saas/commit/301d35d9389334a3f30bb18c48f0e2248f8b0c67))
* **vue/account-switcher:** refresh page on account switch and clean up unused watchers ([8413030](https://github.com/prefabs-tech/saas/commit/841303046bcdb292e982fd3bfec3af84c29593b4))
* **vue/my-accounts:** refresh the page after account is switched from my accounts page ([31974a9](https://github.com/prefabs-tech/saas/commit/31974a93a73b492b5937397877f87cf4012d7d75))



# [0.25.0](https://github.com/prefabs-tech/saas/compare/v0.24.0...v0.25.0) (2025-09-02)


### Bug Fixes

* **fastify:** remove slug and domain from account update input for edit operation ([#141](https://github.com/prefabs-tech/saas/issues/141)) ([7b51d48](https://github.com/prefabs-tech/saas/commit/7b51d48b7820815223ceeb760bfcd91775460f94))
* fix the alphabetical order ([f4335ec](https://github.com/prefabs-tech/saas/commit/f4335ec863adfa8a5a1489f3743395277bffa2a5))
* update account existence check and improve localization ([674c457](https://github.com/prefabs-tech/saas/commit/674c4570b26f976bcd88307330d90fa4d7122356))


### Features

* add correct Vue implementation and fix user reactivity issues ([5628023](https://github.com/prefabs-tech/saas/commit/5628023cfea908b6eb9eae9ee51ccf715c2a039d))
* enhance AccountSwitcher with dropdown functionality and improved styling ([2b39fb9](https://github.com/prefabs-tech/saas/commit/2b39fb942d2b5034a6b3a67bcedb46796d2f3f6a))
* implement account settings page and show account details ([ac0789a](https://github.com/prefabs-tech/saas/commit/ac0789a312f780a510e07fc59cdf109eb5f783cf))
* implement accounts dropdown feature with complete functionality and bug fixes ([a57e9ed](https://github.com/prefabs-tech/saas/commit/a57e9ed0be53e282100b54b2f62dea77fd0cde41))
* implement accounts dropdown with SuperTokens dependency fixes and linting improvements ([a69b544](https://github.com/prefabs-tech/saas/commit/a69b54428a5b82846de0d37afac85e2d66fdd306))
* replace AccountSetting.vue and add necessary translations ([cac93de](https://github.com/prefabs-tech/saas/commit/cac93dea00ec6499bb94d7dc8e241b000fca6e15))
* show the accounts dropdown ([3e9c176](https://github.com/prefabs-tech/saas/commit/3e9c17613eef0b47304dd783d8fc6101d516cd54))
* updated account tab components to use in the main app ([074f769](https://github.com/prefabs-tech/saas/commit/074f769a374dea2148c46780151be8cc0579f015))



# [0.24.0](https://github.com/prefabs-tech/saas/compare/v0.23.0...v0.24.0) (2025-08-28)


### Features

* seperate routes ([2e9b954](https://github.com/prefabs-tech/saas/commit/2e9b954534401ba0527e99f21607bed29e167e7c))



# [0.23.0](https://github.com/prefabs-tech/saas/compare/v0.22.2...v0.23.0) (2025-08-26)


### Bug Fixes

* add removed translations ([4f769f5](https://github.com/prefabs-tech/saas/commit/4f769f530c71bd749f576750e89124d99eb92cc4))
* change the validation messages ([9e2f3cd](https://github.com/prefabs-tech/saas/commit/9e2f3cd53e2ec960809f25a1467b15ea802c4255))
* code standard ([8f7ec1a](https://github.com/prefabs-tech/saas/commit/8f7ec1a0e61561e687bac15d5d4d0a5bb1cb84af))
* fix the role picked in the invitation form ([2ac6abd](https://github.com/prefabs-tech/saas/commit/2ac6abdcce34594e54785d6d97ac3b7b891d96d5))
* fix the success message for when invitation is created ([4dc2493](https://github.com/prefabs-tech/saas/commit/4dc2493e43361e69a5c29d1d068838bb38dacace))
* fix the translation for role values in invitations table ([fbf9aa5](https://github.com/prefabs-tech/saas/commit/fbf9aa59bd5e6f262a1815f78047ba5c50630406))
* fix the UserSignupForm ([d783222](https://github.com/prefabs-tech/saas/commit/d7832224c6ababf810fdf9e0c97e271a096fd970))
* remove unnecessary comemnts and type definitions ([0c13d88](https://github.com/prefabs-tech/saas/commit/0c13d8832bbd9ea80648e64611d6d3123d77f801))
* the roles and status translation in users table ([ed731ed](https://github.com/prefabs-tech/saas/commit/ed731ed39c7cfbbb08f220c0e7e6eb92a15c7f70))


### Features

* accept join invitation ([3510452](https://github.com/prefabs-tech/saas/commit/3510452352bc7338b361e2f77e2a799fd6e337ba))
* add redirect handling after login for invitation acceptance ([6cc56bd](https://github.com/prefabs-tech/saas/commit/6cc56bd960e3b452d8beac68a85e56808634d8a6))
* close invitation form and update table after invitation created ([9f047e6](https://github.com/prefabs-tech/saas/commit/9f047e65f3b06c0fdba192451cf1e2fd3c9da666))
* enhance join invitation messages and actions in English and French locales ([434d88a](https://github.com/prefabs-tech/saas/commit/434d88aa93714d657e703130168d65bb485ba056))
* implement enable and disable user ([c1d9f65](https://github.com/prefabs-tech/saas/commit/c1d9f65b700cde204465abf226cebdcd94c6805d))
* refactor the invitation signup form ([3900f83](https://github.com/prefabs-tech/saas/commit/3900f832279bc449c596846b9dbaabd72ae17cfc))
* remove JoinInvitation related files ([8d850a4](https://github.com/prefabs-tech/saas/commit/8d850a4b09108e863c6bfc24f0bcd98b9cd2f9cf))
* **routes:** add invitation routes for token-based access ([ca00054](https://github.com/prefabs-tech/saas/commit/ca00054bf90ea254167f6022f3083405ce20d73e))
* show confimation modal during resend and revoke of invitations ([a9883d1](https://github.com/prefabs-tech/saas/commit/a9883d1f3986d39ec90913879fc84313bfb9ac4f))
* show join invitation form ([a09d08b](https://github.com/prefabs-tech/saas/commit/a09d08beab5e645a732bbc3d3430864f47a22a7e))
* show notification toast for resend, revoke and delete of invitation ([e912bf7](https://github.com/prefabs-tech/saas/commit/e912bf7d216c2716095a7a848fd2f34f008c1d4f))
* translate the invitation created message for french ([354a601](https://github.com/prefabs-tech/saas/commit/354a60148fcd0ac765a9a93f19f37cd6644e38bc))
* update form ([b8ef9c3](https://github.com/prefabs-tech/saas/commit/b8ef9c30fa8ec163a0d5c340ae4a12e9f77c9fc9))
* update join invitation titles and success messages in English and French locales ([c79c1fc](https://github.com/prefabs-tech/saas/commit/c79c1fc6fad0f0e4b456108c6d893e53eca57e84))
* update styling of signup form ([65fc39a](https://github.com/prefabs-tech/saas/commit/65fc39a6998654bad584e6d125606f9d9f4c055b))
* update vue page for integration with app ([7d31e5d](https://github.com/prefabs-tech/saas/commit/7d31e5dc972a230232146687ff665bd36cbae16a))



## [0.22.2](https://github.com/prefabs-tech/saas/compare/v0.22.1...v0.22.2) (2025-08-18)


### Bug Fixes

* exclude / route by default from account discovery for main app ([f4457b0](https://github.com/prefabs-tech/saas/commit/f4457b06f4179e3cb904b7a0d8a3da520ea3df0b))



## [0.22.1](https://github.com/prefabs-tech/saas/compare/v0.22.0...v0.22.1) (2025-08-14)


### Bug Fixes

* add files migration ([773e3ef](https://github.com/prefabs-tech/saas/commit/773e3ef4b6672b0b7aec56a94cf41f59b11f33ae))



# [0.22.0](https://github.com/prefabs-tech/saas/compare/v0.21.0...v0.22.0) (2025-08-01)



# [0.21.0](https://github.com/12deg/saas/compare/v0.20.0...v0.21.0) (2025-07-31)


### Features

* **account-tabs:** allow to customize tabs ([#115](https://github.com/12deg/saas/issues/115)) ([f122991](https://github.com/12deg/saas/commit/f1229917f2053143960beba002c049fbab2dfc8f))



# [0.20.0](https://github.com/12deg/saas/compare/v0.19.2...v0.20.0) (2025-07-16)


### Features

* **account-types:** add entity config ([#114](https://github.com/12deg/saas/issues/114)) ([dc98296](https://github.com/12deg/saas/commit/dc982969c23fdefc703db1c6c08fa53f90fe8f71))
* **react/subdomains:** show error message for unregistered subdomains ([c0d75aa](https://github.com/12deg/saas/commit/c0d75aa406ac7a8bbea58ea35024ea423a5dbbe9))
* **react/unregistered-domain:** add page and translations ([c216ccb](https://github.com/12deg/saas/commit/c216ccb0deff1ee1ed6146bb2f7e5bae8cf35a98))
* **subdomains:** update config usage for admin app ([37697ae](https://github.com/12deg/saas/commit/37697ae6f33c25f23025de6e1febd42f0e50d207))



## [0.19.2](https://github.com/12deg/saas/compare/v0.19.1...v0.19.2) (2025-06-06)



## [0.19.1](https://github.com/12deg/saas/compare/v0.19.0...v0.19.1) (2025-05-29)


### Features

* add custom tabs on account view page ([10f12c6](https://github.com/12deg/saas/commit/10f12c6ef3cf578181ca535c8ff7f07580a008d2))



# [0.19.0](https://github.com/12deg/saas/compare/v0.18.1...v0.19.0) (2025-05-26)

### BREAKING CHANGES

* refactor: sync fastify package with latest dzangolab fastify packages ([7a14d05](https://github.com/12deg/saas/commit/7a14d05cd472260649e6e55c1cc83353a29238d0))

## [0.18.1](https://github.com/12deg/saas/compare/v0.18.0...v0.18.1) (2025-05-26)


### Features

* add accounts stores and vue components ([5f54c93](https://github.com/12deg/saas/commit/5f54c93356d679212a8ecbb0b8ead5fa088d0c44))
* add badge for roles and invitations status ([8009411](https://github.com/12deg/saas/commit/80094111526e3bcd0301abb88ed107dbe9fe5511))
* add components for add and edit account ([cb2ef42](https://github.com/12deg/saas/commit/cb2ef429567b30d4fecc83c0e4aba89e3a49fb8f))
* add components for invitations ([c889636](https://github.com/12deg/saas/commit/c889636718a5f06de30451d5b367e8c523b4b87b))
* add necessary translations ([5fbde3c](https://github.com/12deg/saas/commit/5fbde3cb694f3e74a25bc5e0dddd5bc0fe16f207))
* add translations ([64ae0d4](https://github.com/12deg/saas/commit/64ae0d4c23ce45cdf41f4dcfc92bcae333e70be5))
* add users table ([6cec398](https://github.com/12deg/saas/commit/6cec3982a72a21c2bb13c8fd89cd5412e387fcaf))
* add validation on the form ([e6a5c09](https://github.com/12deg/saas/commit/e6a5c0911f0851f476db5f33e330b04d6c9f8f11))
* display customer info page and details ([a556b58](https://github.com/12deg/saas/commit/a556b58eda6e688f9e28d64e060613dea8b7c907))
* export only components stub page ([c897ccb](https://github.com/12deg/saas/commit/c897ccb4574cf3fde12233373914c26768c01085))
* export router ([8fe7339](https://github.com/12deg/saas/commit/8fe7339705c2137c3c495ab9166f0b74b0e319ec))
* fix plugin structure to send notification ([50cbc1f](https://github.com/12deg/saas/commit/50cbc1fa58824e2d718cfd09dfa02bce320849b2))
* implment add invitation ([479cdd8](https://github.com/12deg/saas/commit/479cdd84de13594f62654cbddeed650cd652d031))
* implment resend and revoke invitation feature ([4e348f2](https://github.com/12deg/saas/commit/4e348f236ee1fb2610efc9b939a16ac4e436f740))
* initiate vue sass from vue user ([ab8f713](https://github.com/12deg/saas/commit/ab8f7137b6e66c4e2134ce42d8a9410be7a501e3))
* moved validations to next file and add entity to know the individual options ([6b22145](https://github.com/12deg/saas/commit/6b22145e8d2cdc71fef895f4a97eea633833b4c0))
* option to get roles from the configs ([84154b1](https://github.com/12deg/saas/commit/84154b1e41b5b08003132034ddc05c79eb00d197))
* remove test directory ([243266d](https://github.com/12deg/saas/commit/243266dde5ca2e95837f8dc6b12d80112d269097))
* remove un necessary components ([fdfc9ca](https://github.com/12deg/saas/commit/fdfc9ca80a7606c87a53b050fdb11482a2f9e68d))
* remove un-necessary code ([eae3249](https://github.com/12deg/saas/commit/eae32493cb788bc5ad2e18f4f50745c26f7fae28))
* remove un-necessary codes from users table ([5b0fbfe](https://github.com/12deg/saas/commit/5b0fbfe17fb57bbc3db590304678213c689cc6fe))
* remove un-necessary tests ([a06b2ec](https://github.com/12deg/saas/commit/a06b2ec5ed279594fe3437999b66b39c6d82ccd5))
* remove unused packages and moved axios ([c5b4685](https://github.com/12deg/saas/commit/c5b46859f3bbe3f801e64eb183c562bd334a0434))
* removed unused css ([2086445](https://github.com/12deg/saas/commit/2086445150d5d789cf55def9eb08cd31b1a5bc1e))
* udapte code standards ([5867d87](https://github.com/12deg/saas/commit/5867d87bb1470697786f94b54fd4c3c5339a69c1))
* update code standard ([71c5870](https://github.com/12deg/saas/commit/71c58700eb53d4f0fa69ed84337e50f9bdd8dbdb))
* update code standard ([58a9c7c](https://github.com/12deg/saas/commit/58a9c7c1f19e66bdbcf0ab182cd147616b017871))
* update code standard ([ae5499f](https://github.com/12deg/saas/commit/ae5499fc79f733237798f940744f44e61b1a6fc6))
* update code standard ([7290a0a](https://github.com/12deg/saas/commit/7290a0a9a0230fea2e73cd105acef08f423cf46c))
* update code standards ([af69ca2](https://github.com/12deg/saas/commit/af69ca2b8a583f6baf0c539eadd1f4ee756f94c2))
* update code standards ([d4182ae](https://github.com/12deg/saas/commit/d4182aeea2fd83d4faf2333d9aa6667993d68511))
* update code standards ([3522b0f](https://github.com/12deg/saas/commit/3522b0f36fdd9d4c603785242f708775223821db))
* update code standards and remove unused components ([b343c47](https://github.com/12deg/saas/commit/b343c479cfa3b638748898c26ddc6c67b404e8f9))
* update css for form actions ([23e73d4](https://github.com/12deg/saas/commit/23e73d4ca7daf55a501d69d78142c6d13a826375))
* update customer to account typo ([1f05bee](https://github.com/12deg/saas/commit/1f05bee300647bf2bcb4ee49225ec4e9ebc06786))
* update events for cancel and submit ([0eee401](https://github.com/12deg/saas/commit/0eee401b573778f388b93e9b338e0c5794b19e0b))
* update invitation form ([7a2d755](https://github.com/12deg/saas/commit/7a2d755cdd44ba02219846e04640fe9e78af6262))
* update lint config for trailing coma ([54c6591](https://github.com/12deg/saas/commit/54c6591f9e917371e8b5fc161a452dd924deefb7))
* update plugin to support translations ([577391b](https://github.com/12deg/saas/commit/577391b8b6a0df84a8e66dec6b883035b2285f93))
* update route options ([aae7be1](https://github.com/12deg/saas/commit/aae7be161ac674159e6ddee26d593183ef2eaddc))
* update routers ([58938da](https://github.com/12deg/saas/commit/58938da2b3c5a9423ff314aa7f1ea04962fd4002))
* update routes ([743ec90](https://github.com/12deg/saas/commit/743ec90c9cd3baf5a86fd21dae168256915656bb))
* update routes and form actions ([b5c4292](https://github.com/12deg/saas/commit/b5c42929a1f9360ac4b3d574f56b37f930809a2d))
* update store for invitations ([5a5c953](https://github.com/12deg/saas/commit/5a5c9531defbd1c13c9bd52a9bd0bca5462827a9))
* update styles and remove unused class ([7901be5](https://github.com/12deg/saas/commit/7901be50be38f7f624f4ad35b65ce36b606605d0))
* update table and enable edit fields ([3cfbae3](https://github.com/12deg/saas/commit/3cfbae376c47577e6256ef1c96a43b34f61e8452))
* update table to have in built add action ([ecd48c7](https://github.com/12deg/saas/commit/ecd48c7f43c4ac767c42a75f72a06f6cf05c1722))
* update translations ([9af1fac](https://github.com/12deg/saas/commit/9af1fac25555f11473be0e044697daa0f15a3693))
* update translations ([49aa432](https://github.com/12deg/saas/commit/49aa432cb5debfe527c8b04050c0164a9018a604))
* update translations ([5dbddb9](https://github.com/12deg/saas/commit/5dbddb9e596db6b8e86d62802d66c1820a016353))
* update translations ([45a89e2](https://github.com/12deg/saas/commit/45a89e26a5a2a420e9f9d08605820bf9cc5551a9))
* update translations ([f60b207](https://github.com/12deg/saas/commit/f60b207d1f73fbe7bcaed1750cf089d1791a030e))
* update translations ([289668e](https://github.com/12deg/saas/commit/289668e3dc5c153f2d88b8afa46b7c4d8b13df70))
* update translations ([427091c](https://github.com/12deg/saas/commit/427091c5d4cc69cc1ce8d8740b2d1a9a1bfa002b))
* update translations ([cbf64fb](https://github.com/12deg/saas/commit/cbf64fb1ecdb806ea2158300b4bbb62958c6e9f3))
* update translations and form ([8c0cd72](https://github.com/12deg/saas/commit/8c0cd72a251eb1a61012dca43d2aaf0c4c29c49b))
* update validation ([3942562](https://github.com/12deg/saas/commit/39425628216faa63b8fe4011f04f0926e14ce838))
* update validations for entity ([2e4f443](https://github.com/12deg/saas/commit/2e4f4436a087c35f068e1a71f486142763cf2e3d))
* update view page ([529be2d](https://github.com/12deg/saas/commit/529be2dd99a8006f356193c87f1919cf276feb59))
* used config to display the data ([ea7d3e4](https://github.com/12deg/saas/commit/ea7d3e49163175998628110bb43dd684f2e74791))



# [0.18.0](https://github.com/12deg/saas/compare/v0.17.1...v0.18.0) (2025-04-07)


### BREAKING CHANGES

* Requires Fastify >=5.2.1. See [V5 Migration Guide](https://fastify.dev/docs/latest/Guides/Migration-Guide-V5) for more details.
* Only support Node.js v20+

### Bug Fixes

* fix create sql for account user sql factory ([b6cd9ed](https://github.com/12deg/saas/commit/b6cd9ed1424ff77ea3754e553203bcbbed5b6513))
* fix deleteSql in AccountAwareSqlFactory ([b9d6d45](https://github.com/12deg/saas/commit/b9d6d45317604be56409b3c279ab39c2e956f46c))



## [0.17.1](https://github.com/12deg/saas/compare/v0.17.0...v0.17.1) (2025-03-27)


### Bug Fixes

* **invitations:** show error message correctly ([df04f12](https://github.com/12deg/saas/commit/df04f120714c4a14734bf77857842d02700fe4d6))



# [0.17.0](https://github.com/12deg/saas/compare/v0.16.2...v0.17.0) (2025-03-26)


### Bug Fixes

* fix accept invitation route for authenticated user without request body ([c58de86](https://github.com/12deg/saas/commit/c58de861f9cadf8628e81125cb1deb9c857838cf))
* remove unwanted comment ([23cb91f](https://github.com/12deg/saas/commit/23cb91f87395868333da21c9743bc85ac4b056a4))


### Features

* **account:** update my-account to account-settings ([cd55111](https://github.com/12deg/saas/commit/cd55111373b0c36ff340ec28db401e99d1888f34))
* **config:** remove unwanted support for custom storage key ([a07ae3e](https://github.com/12deg/saas/commit/a07ae3e5153c61081aa77600ec8a7c58ad56cd22))
* **join-acccount:** refetch accounts after accepting invitation ([b110bdd](https://github.com/12deg/saas/commit/b110bddb3dabae5ce4bf5ed63c671e97a4d4f6d8))
* **join-account:** add join account page ([0ceb37e](https://github.com/12deg/saas/commit/0ceb37e3b4c0e8787fa78a589410485a782c4814))
* **join-account:** add new accept-invitation route and page ([9e8ad6c](https://github.com/12deg/saas/commit/9e8ad6cbc7d771f1791d66f55c38e974e2f1aa0b))
* **my-account:** add constant for account header name ([1db1478](https://github.com/12deg/saas/commit/1db14781a6a5c4c9557ca237319c42eafd7eaa27))
* **my-account:** add my-account route for the app ([1b6ad99](https://github.com/12deg/saas/commit/1b6ad99020ea38e5f3f53e65d22e81b4a8f149e8))
* **my-account:** add x-account-id header for all requests ([dc67d4f](https://github.com/12deg/saas/commit/dc67d4f6aa29437a4668f8ca7951086f6ecbc782))
* **my-account:** update accounts page ([ecc2a98](https://github.com/12deg/saas/commit/ecc2a98c6eec1dbec3dfb110fd86685b4ddb28ef))
* **my-account:** use my-account endpoint ([183c409](https://github.com/12deg/saas/commit/183c409d286c385cef84fa1d0b7b5653dcbe45aa))



## [0.16.2](https://github.com/12deg/saas/compare/v0.16.1...v0.16.2) (2025-03-21)



## [0.16.1](https://github.com/12deg/saas/compare/v0.16.0...v0.16.1) (2025-03-21)


### Bug Fixes

* **styles:** update export file ([c83721b](https://github.com/12deg/saas/commit/c83721b75ba00bb1c61fa75ee496e3f790fbf8f4))



# [0.16.0](https://github.com/12deg/saas/compare/v0.15.0...v0.16.0) (2025-03-19)


### Features

* add account aware base service and sql factory ([#78](https://github.com/12deg/saas/issues/78)) ([69903de](https://github.com/12deg/saas/commit/69903de578a2cab327e9a95b4093f1f6df8b0af6))



# [0.15.0](https://github.com/12deg/saas/compare/v0.14.0...v0.15.0) (2025-03-12)


### Features

* customizable email subject and templateName from config ([#76](https://github.com/12deg/saas/issues/76)) ([7eb48e0](https://github.com/12deg/saas/commit/7eb48e0d1472b19cc986f82780a39c70695483e1))



# [0.14.0](https://github.com/12deg/saas/compare/v0.13.0...v0.14.0) (2025-03-04)


### Code Refactoring

* **routes:** update protected route names ([f5d4660](https://github.com/12deg/saas/commit/f5d4660d56750481b1b119ddeed041cee92b104f))


### Features

* add account types models and migrations ([#71](https://github.com/12deg/saas/issues/71)) ([c7f77f1](https://github.com/12deg/saas/commit/c7f77f1d050eeb8ed172699932d9b858bf6a9b70))


### BREAKING CHANGES

* **routes:** getSaasAdminProtectedRoutes and getSaasAppProtectedRoutes have been renamed to
getSaasAdminRoutes and getSaasAppRoutes, respectively.



# [0.13.0](https://github.com/12deg/saas/compare/v0.12.0...v0.13.0) (2025-02-24)


### Features

* **routes:** add routes from the package + refactor components ([a0f55b1](https://github.com/12deg/saas/commit/a0f55b1c85216d162d29eb7e0ab55e4acfe851aa))
* **routes:** update my accounts page ([96ac9fd](https://github.com/12deg/saas/commit/96ac9fdba05b27e19e95d82c25977876ee5e21fe))



# [0.12.0](https://github.com/12deg/saas/compare/v0.11.1...v0.12.0) (2025-02-21)


### Bug Fixes

* remove unwanted translations ([2ef5752](https://github.com/12deg/saas/commit/2ef575239d25549f1977548e6e35f9e2f80bdd48))
* update accounts data model ([d7f2a9c](https://github.com/12deg/saas/commit/d7f2a9c12475a81b743bfe21abc90a7788b868a6))


### Features

* accept account invitation for existing users ([#64](https://github.com/12deg/saas/issues/64)) ([2673182](https://github.com/12deg/saas/commit/267318253b3a8308af7ba4f9b54bc11e3d9dac7d))
* **account:** update AccountShow ([320069e](https://github.com/12deg/saas/commit/320069e57d47584e542f1720d19fd886ccfdb2a2))



## [0.11.1](https://github.com/12deg/saas/compare/v0.11.0...v0.11.1) (2025-02-20)


### Bug Fixes

* discover customer in onRequest hook instead of preHandler hook ([7ea314b](https://github.com/12deg/saas/commit/7ea314ba35d4b5e18a89cb38a5cefffc784bfadf))



# [0.11.0](https://github.com/12deg/saas/compare/v0.10.0...v0.11.0) (2025-02-19)


### Bug Fixes

* fix customer invitation link ([#59](https://github.com/12deg/saas/issues/59)) ([af9033e](https://github.com/12deg/saas/commit/af9033ea7b843ee3d63fd8993f9d3184524680e9))


### Features

* **invitation:** add AcceptInvitation page ([d30c255](https://github.com/12deg/saas/commit/d30c2555dcc8fc865d55833f54ca9e94882e4dee))
* **invitations:** improve callbacks ([5e0e34d](https://github.com/12deg/saas/commit/5e0e34d6912891b9d3a9451381414b7013333595))
* **signup:** improve terms and conditions field ([6e37b4d](https://github.com/12deg/saas/commit/6e37b4d80236b9c12278bbb53591c0bfd24006f1))



# [0.10.0](https://github.com/12deg/saas/compare/v0.9.0...v0.10.0) (2025-02-18)


### Bug Fixes

* **customer-users:** update enable and disable actions ([90123fe](https://github.com/12deg/saas/commit/90123fe0d9c9df7c23832f5f1e403e60adb574d4))


### Features

* **customer-users:** add users page ([ed5d506](https://github.com/12deg/saas/commit/ed5d506c319740808b01516cf17157ade0044283))
* **customer-users:** allow to select role for invitation ([ce4625e](https://github.com/12deg/saas/commit/ce4625edf4edd11a56b2ecaff8650c6baa8bd576))



# [0.9.0](https://github.com/12deg/saas/compare/v0.8.2...v0.9.0) (2025-02-17)


### Features

* **customer:** add users table ([8406bc5](https://github.com/12deg/saas/commit/8406bc540bc1fc74ba5b55ecd66085b90999055d))
* **customers:** add invitations components ([6bc0d82](https://github.com/12deg/saas/commit/6bc0d821ce90b313720ed1be98d70693e1b35f75))
* **invitations:** add translations ([4501104](https://github.com/12deg/saas/commit/450110457dc55d281f92f31aaf5782dc763a1c49))
* **invitations:** refine invitations api calls ([6263455](https://github.com/12deg/saas/commit/626345564fed56a151423c97afd75a92a19a2125))



## [0.8.2](https://github.com/12deg/saas/compare/v0.8.1...v0.8.2) (2025-02-14)


### Features

* register saas routes on plugin register ([#48](https://github.com/12deg/saas/issues/48)) ([706af99](https://github.com/12deg/saas/commit/706af99c2b9941ce8bd4266df797e9325c920303))



## [0.8.1](https://github.com/12deg/saas/compare/v0.8.0...v0.8.1) (2025-02-14)


### Features

* add get customer users endpoint ([#46](https://github.com/12deg/saas/issues/46)) ([91d6764](https://github.com/12deg/saas/commit/91d6764922837b77df5da785efc8653cc1bee996))



# [0.8.0](https://github.com/12deg/saas/compare/v0.7.0...v0.8.0) (2025-02-11)


### Features

* add customer invitations model ([#36](https://github.com/12deg/saas/issues/36)) ([42cad4c](https://github.com/12deg/saas/commit/42cad4c480cb926ee08e366a271be1a5cae1a0c0))



# [0.7.0](https://github.com/12deg/saas/compare/v0.6.0...v0.7.0) (2025-02-11)


### Features

* **accounts:** add accounts page component ([6fae366](https://github.com/12deg/saas/commit/6fae3660af42ff371430a42d56e20d0d8c699d81))
* **accounts:** show limited information in my accounts page ([5f5c3df](https://github.com/12deg/saas/commit/5f5c3dffd717d5ffdbe2014a94b82014b096128a))



# [0.6.0](https://github.com/12deg/saas/compare/v0.5.0...v0.6.0) (2025-02-10)


### Features

* **customers:** add CustomerForm and CustomersTable comopnents ([#31](https://github.com/12deg/saas/issues/31)) ([5d83183](https://github.com/12deg/saas/commit/5d83183ab04d09837b3ebe685e070d701f372463))



# [0.5.0](https://github.com/12deg/saas/compare/v0.4.0...v0.5.0) (2025-02-07)


### Features

* **customer:** add customer schema and update types ([e934680](https://github.com/12deg/saas/commit/e934680b98ef77320f24a25ad3756eecf8323077))



# [0.4.0](https://github.com/12deg/saas/compare/v0.3.4...v0.4.0) (2025-02-06)


### Bug Fixes

* prefix auth user when customer opted for subdomain ([#27](https://github.com/12deg/saas/issues/27)) ([ad5ae50](https://github.com/12deg/saas/commit/ad5ae50107b5786863be539659583f5ac8fe54cb))


### Features

* **accounts:** add customer signup forms ([#30](https://github.com/12deg/saas/issues/30)) ([0217aa4](https://github.com/12deg/saas/commit/0217aa4effc5e18c93d7734ea6b6a8b3745fc48d))



## [0.3.4](https://github.com/12deg/saas/compare/v0.3.3...v0.3.4) (2025-01-30)


### Bug Fixes

* fix validation on create customer ([#28](https://github.com/12deg/saas/issues/28)) ([9ad616f](https://github.com/12deg/saas/commit/9ad616f0ef252e15fab69b156351f3c7e851fed8))



## [0.3.3](https://github.com/12deg/saas/compare/v0.3.2...v0.3.3) (2025-01-27)


### Bug Fixes

* fix email password signup with auto verify user context enabled ([c59e832](https://github.com/12deg/saas/commit/c59e83243e07ce6d2a91bde98d66464fab720642))



## [0.3.2](https://github.com/12deg/saas/compare/v0.3.1...v0.3.2) (2025-01-24)


### Bug Fixes

* fix email verification for saas owner signup ([23d1520](https://github.com/12deg/saas/commit/23d1520efe11d2cdec9f70b2626ae879a8c0eed1))


### Features

* delete customer if error in user signup ([77c7783](https://github.com/12deg/saas/commit/77c77832c8e93bb960abfe21b247a0bf894f2c6f))
* support saas account owner singup from main app ([63a324f](https://github.com/12deg/saas/commit/63a324fb092852bea8569b882f6b9fb70a6de234))



## [0.3.1](https://github.com/12deg/saas/compare/v0.3.0...v0.3.1) (2025-01-22)


### Bug Fixes

* **customers:** update type to include database column ([14e5c42](https://github.com/12deg/saas/commit/14e5c42a664fabad29f67fcdb4d29f0d301c1fd6))



# [0.3.0](https://github.com/12deg/saas/compare/v0.2.1...v0.3.0) (2025-01-22)


### Bug Fixes

* fix create customer method in customer service ([495bd99](https://github.com/12deg/saas/commit/495bd99352b96f4c48122f1e74ce3f55052b5376))
* fix customer discovery ([0d56cd3](https://github.com/12deg/saas/commit/0d56cd34b5f9cca8f606c6f6f5ebafbf85e170f8))
* fix supertokens recipe config ([74b310c](https://github.com/12deg/saas/commit/74b310c45acec6bdf964d560dd3b3559bc0b092e))
* fix zod schema for slug ([852bbc1](https://github.com/12deg/saas/commit/852bbc1876e2f797506b5c104c99f60088c7f268))


### Features

* add my account endpoint ([9978fa8](https://github.com/12deg/saas/commit/9978fa8cb7e44125c2b5508452dfbe6a7b30441a))
* add my accounts endpoint ([13ce15b](https://github.com/12deg/saas/commit/13ce15bb4a1ae1c4b89ecbf4826d44281572c71d))
* configurable saas related tables ([99c3275](https://github.com/12deg/saas/commit/99c3275039de5f510f2fa374a13d2107102f80f5))
* use separate column to store schema/database name ([306b4ea](https://github.com/12deg/saas/commit/306b4eaca5b2377930eb0a590b2ee474d8535f31))


### Performance Improvements

* make my accounts handler configurable from saas config ([b75809f](https://github.com/12deg/saas/commit/b75809fbd012196fa90121cc43e6f043baa82b12))



## [0.2.1](https://github.com/12deg/saas/compare/v0.2.0...v0.2.1) (2024-12-20)


### Bug Fixes

* skip running customer migrations for customer who don't have slug ([9030451](https://github.com/12deg/saas/commit/9030451e228294ff094a329a1f921bfb50fa2e64))



# [0.2.0](https://github.com/12deg/saas/compare/v0.1.0...v0.2.0) (2024-12-19)


### Features

* add saas account member role to customer user on signup ([ca1b239](https://github.com/12deg/saas/commit/ca1b239163ff8d5bf3730088b57834b88197e43f))
* create saas roles on plugin register ([c38a295](https://github.com/12deg/saas/commit/c38a295eedf0e0dcd9ba223f5fe5912705e1a9e6))
* customer discovery ([94ec438](https://github.com/12deg/saas/commit/94ec438b7864e6a8e39b0f42a276d2a1110ec6e1))
* update customer discovery ([561feb2](https://github.com/12deg/saas/commit/561feb293f478c32e9fa25ebc754ec9a5cdc986f))



# 0.1.0 (2024-12-09)
