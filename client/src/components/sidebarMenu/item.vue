<template>
    <component :is="item.component" v-if="item.component && !isItemHidden"/>
    <div v-else-if="item.header && !isItemHidden" class="vsm--header" :class="item.class" v-bind="item.attributes">
        {{ title }}
    </div>
    <div v-else-if="!isItemHidden"
         class="vsm--item"
         :class="[{'vsm--item_open' : show}]"
         @mouseenter="mouseEnterEvent">
        <template v-if="isRouterLink">
            <router-link :class="itemLinkClass"
                         :to="itemLinkHref"
                         :disabled="item.disabled"
                         :tabindex="item.disabled ? -1 : undefined"
                         v-bind="item.attributes"
                         @click.native="clickEvent">
                <template v-if="item.icon">
                    <i v-if="typeof item.icon === 'string' || (item.icon instanceof String)" class="vsm--icon" :class="item.icon"></i>
                    <component
                            :is="item.icon.element ? item.icon.element : 'i'"
                            v-else
                            class="vsm--icon"
                            :class="item.icon.class"
                            v-bind="item.icon.attributes">
                        {{ item.icon.text }}
                    </component>
                </template>
                <template v-if="(isCollapsed && !isFirstLevel) || !isCollapsed || mobileItem">
                    <component
                            :is="item.badge.element ? item.badge.element : 'span'"
                            v-if="item.badge"
                            :style="[rtl ? (item.children ? {'margin-left' : '30px'} : '') : (item.child ? {'margin-right' : '30px'} : '')]"
                            class="vsm--badge"
                            :class="item.badge.class"
                            v-bind="item.badge.attributes">
                        {{ item.badge.text }}
                    </component>
                    <span class="vsm--title">{{ title }}</span>
                    <div
                            v-if="item.children"
                            class="vsm--arrow"
                            :class="[{'vsm--arrow_open' : show}, {'vsm--arrow_slot' : $slots['dropdown-icon']}]"
                    >
                        <slot name="dropdown-icon" />
                    </div>
                </template>
            </router-link>
        </template>
        <template v-else>
            <a :class="itemLinkClass"
               :href="itemLinkHref"
               :disabled="item.disabled"
               :tabindex="item.disabled ? -1 : undefined"
               v-bind="item.attributes"
               @click="clickEvent">
                <template v-if="item.icon">
                    <i v-if="typeof item.icon === 'string' || (item.icon instanceof String)" class="vsm--icon" :class="item.icon"></i>
                    <component :is="item.icon.element ? item.icon.element : 'i'"
                               v-else
                               class="vsm--icon"
                               :class="item.icon.class"
                               v-bind="item.icon.attributes">
                        {{ item.icon.text }}
                    </component>
                </template>
                <template v-if="(isCollapsed && !isFirstLevel) || !isCollapsed || mobileItem">
                    <component :is="item.badge.element ? item.badge.element : 'span'"
                               v-if="item.badge"
                               :style="[rtl ? (item.children ? {'margin-left' : '30px'} : '') : (item.children ? {'margin-right' : '30px'} : '')]"
                               class="vsm--badge"
                               :class="item.badge.class"
                               v-bind="item.badge.attributes">
                        {{ item.badge.text }}
                    </component>
                    <span class="vsm--title">{{ title }}</span>
                    <div v-if="item.children"
                         class="vsm--arrow"
                         :class="[{'vsm--arrow_open' : show}, {'vsm--arrow_slot' : $slots['dropdown-icon']}]">
                        <slot name="dropdown-icon" />
                    </div>
                </template>
            </a>
        </template>
        <template v-if="item.children">
            <template v-if="(isCollapsed && !isFirstLevel) || !isCollapsed">
                <transition name="expand"
                            @enter="expandEnter"
                            @afterEnter="expandAfterEnter"
                            @beforeLeave="expandBeforeLeave">
                    <div v-if="show" class="vsm--dropdown">
                        <list-item :items="item.children"
                                  :level="level+1"
                                  :show-child="showChild"
                                  :rtl="rtl"
                                  :is-collapsed="isCollapsed">
                            <slot   slot="dropdown-icon" name="dropdown-icon"/>
                        </list-item>
                    </div>
                </transition>
            </template>
        </template>
    </div>
</template>

<script>
import { animationMixin } from './mixin'

export default {
	name: 'item',
	components: {
		ListItem: () => import('./listItem.vue')
	},
	mixins: [animationMixin],
	props: {
		item: {
			type: Object,
			required: true
		},
		level: {
			type: Number,
			default: 1
		},
		isCollapsed: {
			type: Boolean
		},
		mobileItem: {
			type: Boolean,
			default: false
		},
		activeShow: {
			type: Number,
			default: null
		},
		showChild: {
			type: Boolean,
			default: false
		},
		showOneChild: {
			type: Boolean,
			default: false
		},
		rtl: {
			type: Boolean,
			default: false
		}
	},
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
			if (item.name) {
				return this.matchRouteByName(item.name)
			}
			if (item.meta && item.meta.href) {
				return this.matchRouteByHref(item.href)
			}
			if (item.alias) {
				return this.isAliasActive(item)
			}
			return false
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
				return this.matchRouteByHref(item.alias)
			}
			return false
		},
		matchRouteByHref(itemRoute) {
			if (this.$router) {
				const { route } = this.$router.resolve(itemRoute)
				return route.fullPath === this.$route.fullPath
			}
			return itemRoute === window.location.pathname + window.location.search + window.location.hash
		},
		matchRouteByName(itemRoute) {
			return this.$route.matched.some(item => item.name === itemRoute)
		},
		clickEvent(event) {
			this.emitItemClick(event, this.item)

			if ((!this.item.meta.href && !this.item.children) || this.item.disabled) {
				event.preventDefault()
				return
			}

			if (!this.mobileItem && this.isCollapsed && this.isFirstLevel) {
				this.$emit('unset-mobile-item', true, this.item.children !== undefined)
			}

			if (!this.item.children) {
				if (this.showOneChild) this.emitActiveShow(null)
			} else {
				if (!this.item.meta.href) event.preventDefault()
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
			return (this.$router && this.item && this.item.meta && this.item.meta.href !== undefined) === true
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
			if (!this.$router && (!this.item.meta.href || typeof this.item.meta.href !== 'string')) return '#'
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
</script>
