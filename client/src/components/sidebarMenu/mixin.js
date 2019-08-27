export const itemMixin = {
	data() {
		return {
			active: false,
			childActive: false,
			itemShow: false
		}
	},
	created() {
		this.initActiveState()
		this.initShowState()

		if (!this.$router) {
			window.addEventListener('hashchange', this.initActiveState)
		}
	},
	destroyed() {
		if (!this.$router) {
			window.removeEventListener('hashchange', this.initActiveState)
		}
	},
	methods: {
		isLinkActive(item) {
			if (!item.href) return false
			return this.matchRoute(item.href) || this.isAliasActive(item)
		},
		isChildActive(children) {
			if (!children) return false
			return children.some(item => this.isLinkActive(item) || (item.children ? this.isChildActive(item.children) : false))
		},
		isAliasActive(item) {
			if (item.alias) {
				if (Array.isArray(item.alias)) {
					return item.alias.some(alias => this.matchRoute(alias))
				}
				return this.matchRoute(item.alias)
			}
			return false
		},
		matchRoute(itemRoute) {
			if (this.$router) {
				const { route } = this.$router.resolve(itemRoute)
				return route.fullPath === this.$route.fullPath
			}
			return itemRoute === window.location.pathname + window.location.search + window.location.hash
		},
		clickEvent(event) {
			this.emitItemClick(event, this.item)

			if ((!this.item.href && !this.item.children) || this.item.disabled) {
				event.preventDefault()
				return
			}

			if (!this.mobileItem && this.isCollapsed && this.isFirstLevel) {
				this.$emit('unset-mobile-item', true, this.item.children !== undefined)
			}

			if (!this.item.children) {
				if (this.showOneChild) this.emitActiveShow(null)
			} else {
				if (!this.item.href) event.preventDefault()
				if (this.mobileItem) return
				if (this.showOneChild) {
					this.activeShow === this._uid ? this.setActiveShow(false) : this.setActiveShow(true, this._uid)
				} else {
					this.itemShow = !this.itemShow
				}
			}
		},
		setActiveShow(itemShow, uid = null) {
			this.emitActiveShow(itemShow ? uid : null)
			this.itemShow = itemShow
		},
		initActiveState() {
			this.active = this.isLinkActive(this.item)
			this.childActive = this.isChildActive(this.item.children)
		},
		initShowState() {
			if (this.item && this.item.children) {
				this.itemShow = this.active || this.childActive
				if (this.showOneChild && !this.showChild && this.isFirstLevel && (this.active || this.childActive)) {
					this.emitActiveShow(this._uid)
				}
			}
		},
		mouseEnterEvent(event) {
			if (this.isCollapsed && this.isFirstLevel && !this.mobileItem && !this.item.disabled) {
				this.$emit('set-mobile-item', { event, item: this.item })
			}
		}
	},
	computed: {
		isRouterLink() {
			return (this.$router && this.item && this.item.href !== undefined) === true
		},
		isFirstLevel() {
			return this.level === 1
		},
		show() {
			if (!this.item.children) return false
			if (this.showChild || this.mobileItem) return true
			if (this.isFirstLevel && this.showOneChild) {
				return this._uid === this.activeShow
			}
			return this.itemShow
		},
		itemLinkClass() {
			return [
				'vsm--link',
				`vsm--link_level-${this.level}`,
				{ 'vsm--link_mobile-item': this.mobileItem },
				{ 'vsm--link_exact-active': this.active },
				{ 'vsm--link_active': this.childActive },
				{ 'vsm--link_disabled': this.item.disabled },
				this.item.class
			]
		},
		isItemHidden() {
			if (this.isCollapsed) {
				if (this.item.hidden && this.item.hiddenOnCollapse === undefined) {
					return true
				}
				return this.item.hiddenOnCollapse === true
			}
			return this.item.hidden === true
		},
		itemLinkHref() {
			if (!this.$router && (!this.item.href || typeof this.item.href !== 'string')) return '#'
			return this.item.href ? this.item.href : '#'
		},
		title() {
			return (this.item.meta && this.item.meta.title) || this.item.name
		}
	},
	watch: {
		$route() {
			this.initActiveState()
		}
	},
	inject: ['emitActiveShow', 'emitItemClick']
}

export const animationMixin = {
	methods: {
		expandEnter(el) {
			el.style.height = `${el.scrollHeight}px`
		},
		expandAfterEnter(el) {
			el.style.height = 'auto'
		},
		expandBeforeLeave(el) {
			if (this.isCollapsed && (this.isFirstLevel || this.level === undefined)) {
				el.style.display = 'none'
				return
			}
			el.style.height = `${el.scrollHeight}px`
		}
	},
}
