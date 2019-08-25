<template>
    <div :class="['tel-input', wrapperClasses, { disabled: disabled }]" ref="reference">
        <div
                v-click-outside="clickedOutside"
                :tabindex="dropdownOptions && dropdownOptions.tabindex ? dropdownOptions.tabindex : 0"
                :class="{ open: open }"
                class="dropdown"
                @keydown="keyboardNav"
                @click="toggleDropdown"
                @keydown.esc="reset"
        >
      <span class="selection" >
        <div v-if="enabledFlags" :class="activeCountry.iso2.toLowerCase()" class="iti-flag" />
        <span v-if="enabledCountryCode" class="country-code">+{{ activeCountry.dialCode }}</span>
        <slot :open="open" name="arrow-icon">
          <span class="dropdown-arrow">{{ open ? "▲" : "▼" }}</span>
        </slot>
      </span>
            <drop v-show="open" ref="dropdown">
                <ul ref="list">
                    <li
                            v-for="(pb, index) in sortedCountries"
                            :key="pb.iso2 + (pb.preferred ? '-preferred' : '')"
                            :class="getItemClass(index, pb.iso2)"
                            class="dropdown-item"
                            @click="choose(pb)"
                            @mousemove="selectedIndex = index"
                    >
                        <div v-if="enabledFlags" :class="pb.iso2.toLowerCase()" class="iti-flag" />
                        <strong>{{ pb.name }}</strong>
                        <span v-if="dropdownOptions && !dropdownOptions.disabledDialCode"
                        >+{{ pb.dialCode }}</span
                        >
                    </li>
                </ul>
            </drop>
        </div>
        <input
                ref="input"
                v-model="phone"
                :placeholder="parsedPlaceholder"
                :disabled="disabled"
                :required="required"
                :autocomplete="autocomplete"
                :name="name"
                :class="inputClasses"
                :id="inputId"
                :maxlength="maxLen"
                :tabindex="inputOptions && inputOptions.tabindex ? inputOptions.tabindex : 0"
                type="tel"
                @blur="onBlur"
                @input="onInput"
                @keyup.enter="onEnter"
                @keyup.space="onSpace"
        />
    </div>
</template>

<script>
    import PhoneNumber from 'awesome-phonenumber';
    import utils, { getCountry } from './utils';
    import Emitter from '../../mixins/emitter'
    function getDefault(key) {
        const value = utils.options[key];
        if (typeof value === 'undefined') {
            return utils.options[key];
        }
        return value;
    }
    // Polyfill for Event.path in IE 11: https://stackoverflow.com/a/46093727
    function getParents(node, memo) {
        const parsedMemo = memo || [];
        const { parentNode } = node;
        if (!parentNode) {
            return parsedMemo;
        }
        return getParents(parentNode, parsedMemo.concat(parentNode));
    }
    export default {
        name: 'tel-input',
        mixins: [ Emitter ],
        components: {
            Drop: () => import('../drop')
        },
        directives: {
            // Click-outside by BosNaufal: https://github.com/BosNaufal/vue-click-outside
            'click-outside': {
                bind(el, binding, vNode) {
                    // Provided expression must evaluate to a function.
                    if (typeof binding.value !== 'function') {
                        const compName = vNode.context.name;
                        let warn = `[Vue-click-outside:] provided expression ${binding.expression} is not a function, but has to be`;
                        if (compName) {
                            warn += `Found in component ${compName}`;
                        }
                        console.warn(warn);
                    }
                    // Define Handler and cache it on the element
                    const { bubble } = binding.modifiers;
                    const handler = (e) => {
                        // Fall back to composedPath if e.path is undefined
                        const path = e.path
                            || (e.composedPath ? e.composedPath() : false)
                            || getParents(e.target);
                        if (bubble || (path.length && !el.contains(path[0]) && el !== path[0])) {
                            binding.value(e);
                        }
                    };
                    el.__vueClickOutside__ = handler;
                    // add Event Listeners
                    document.addEventListener('click', handler);
                },
                unbind(el) {
                    // Remove Event Listeners
                    document.removeEventListener('click', el.__vueClickOutside__);
                    el.__vueClickOutside__ = null;
                },
            },
        },
        props: {
            value: {
                type: String,
                default: '',
            },
            placeholder: {
                type: String,
                default: () => getDefault('placeholder'),
            },
            disabledFetchingCountry: {
                type: Boolean,
                default: () => getDefault('disabledFetchingCountry'),
            },
            disabled: {
                type: Boolean,
                default: () => getDefault('disabled'),
            },
            disabledFormatting: {
                type: Boolean,
                default: () => getDefault('disabledFormatting'),
            },
            mode: {
                type: String,
                default: () => getDefault('mode'),
            },
            invalidMsg: {
                type: String,
                default: () => getDefault('invalidMsg'),
            },
            required: {
                type: Boolean,
                default: () => getDefault('required'),
            },
            allCountries: {
                type: Array,
                default: () => getDefault('allCountries'),
            },
            defaultCountry: {
                // Default country code, ie: 'AU'
                // Will override the current country of user
                type: String,
                default: () => getDefault('defaultCountry'),
            },
            enabledCountryCode: {
                type: Boolean,
                default: () => getDefault('enabledCountryCode'),
            },
            enabledFlags: {
                type: Boolean,
                default: () => getDefault('enabledFlags'),
            },
            preferredCountries: {
                type: Array,
                default: () => getDefault('preferredCountries'),
            },
            onlyCountries: {
                type: Array,
                default: () => getDefault('onlyCountries'),
            },
            ignoredCountries: {
                type: Array,
                default: () => getDefault('ignoredCountries'),
            },
            autocomplete: {
                type: String,
                default: () => getDefault('autocomplete'),
            },
            name: {
                type: String,
                default: () => getDefault('name'),
            },
            wrapperClasses: {
                type: [String, Array, Object],
                default: () => getDefault('wrapperClasses'),
            },
            inputClasses: {
                type: [String, Array, Object],
                default: () => getDefault('inputClasses'),
            },
            inputId: {
                type: String,
                default: () => getDefault('inputId'),
            },
            dropdownOptions: {
                type: Object,
                default: () => getDefault('dropdownOptions'),
            },
            inputOptions: {
                type: Object,
                default: () => getDefault('inputOptions'),
            },
            maxLen: {
                type: Number,
                default: () => getDefault('maxLen'),
            },
            validCharactersOnly: {
                type: Boolean,
                default: () => getDefault('validCharactersOnly'),
            },
            dynamicPlaceholder: {
                type: Boolean,
                default: () => getDefault('dynamicPlaceholder'),
            },
        },
        data() {
            return {
                phone: '',
                activeCountry: { iso2: '' },
                open: false,
                finishMounted: false,
                selectedIndex: null,
                typeToFindInput: '',
                typeToFindTimer: null,
            };
        },
        computed: {
            parsedPlaceholder() {
                if (!this.finishMounted) {
                    return '';
                }
                if (this.dynamicPlaceholder) {
                    const mode = this.mode || 'international';
                    return PhoneNumber.getExample(this.activeCountry.iso2, 'mobile').getNumber(mode);
                }
                return this.placeholder;
            },
            parsedMode() {
                if (this.mode) {
                    if (!['international', 'national'].includes(this.mode)) {
                        console.error('Invalid value of prop "mode"');
                    } else {
                        return this.mode;
                    }
                }
                if (!this.phone) {
                    return 'national';
                }
                return this.phone[0] === '+' ? 'international' : 'national';
            },
            filteredCountries() {
                // List countries after filtered
                if (this.onlyCountries.length) {
                    return this.getCountries(this.onlyCountries);
                }
                if (this.ignoredCountries.length) {
                    return this.allCountries.filter(
                        ({ iso2 }) => !this.ignoredCountries.includes(iso2.toUpperCase())
                            && !this.ignoredCountries.includes(iso2.toLowerCase()),
                    );
                }
                return this.allCountries;
            },
            sortedCountries() {
                // Sort the list countries: from preferred countries to all countries
                const preferredCountries = this.getCountries(this.preferredCountries)
                    .map(country => ({ ...country, preferred: true }));
                return [...preferredCountries, ...this.filteredCountries];
            },
            phoneObject() {
                const result = PhoneNumber(this.phone, this.activeCountry.iso2).toJSON();
                Object.assign(result, {
                    isValid: result.valid,
                    country: this.activeCountry,
                });
                return result;
            },
        },
        watch: {
            // eslint-disable-next-line func-names
            'phoneObject.valid': function (value) {
                if (value) {
                    this.phone = this.phoneObject.number[this.parsedMode];
                }
                this.$emit('validate', this.phoneObject);
                this.$emit('onValidate', this.phoneObject); // Deprecated
            },
            value() {
                this.phone = this.value;
            },
            open(isDropdownOpened) {
                // Emit open and close events
                if (isDropdownOpened) {
                    this.$emit('open');
                } else {
                    this.$emit('close');
                }
            },
            phone(newValue, oldValue) {
                if (this.validCharactersOnly && !this.testCharacters()) {
                    this.$nextTick(() => { this.phone = oldValue; });
                } else if (newValue) {
                    if (newValue[0] === '+') {
                        const code = PhoneNumber(newValue).getRegionCode();
                        if (code) {
                            this.activeCountry = this.findCountry(code) || this.activeCountry;
                        }
                    }
                }
            },
            activeCountry(value) {
                if (value && value.iso2) {
                    this.$emit('country-changed', value);
                }
            },
        },
        mounted() {
            this.initializeCountry()
                .then(() => {
                    if (!this.phone
                        && this.inputOptions
                        && this.inputOptions.showDialCode
                        && this.activeCountry.dialCode) {
                        this.phone = `+${this.activeCountry.dialCode}`;
                    }
                    this.$emit('validate', this.phoneObject);
                    this.$emit('onValidate', this.phoneObject); // Deprecated
                })
                .catch(console.error)
                .finally(() => {
                    this.finishMounted = true;
                });
        },
        created() {
            if (this.value) {
                this.phone = this.value.trim();
            }
        },
        methods: {
            initializeCountry() {
                return new Promise((resolve) => {
                    if (this.phone && this.phone[0] === '+') {
                        const activeCountry = PhoneNumber(this.phone).getRegionCode();
                        if (activeCountry) {
                            this.activeCountry = activeCountry;
                            resolve();
                            return;
                        }
                    }
                    if (this.defaultCountry) {
                        const defaultCountry = this.findCountry(this.defaultCountry);
                        if (defaultCountry) {
                            this.activeCountry = defaultCountry;
                            resolve();
                            return;
                        }
                    }

                    this.activeCountry = this.findCountry(this.preferredCountries[0])
                        || this.filteredCountries[0];

                    if (!this.disabledFetchingCountry) {
                        getCountry().then((res) => {
                            this.activeCountry = this.findCountry(res) || this.activeCountry;
                        }).finally(resolve)
                            .catch((error) => {
                                console.warn(error);
                            });
                    } else {
                        resolve();
                    }
                });
            },

            getCountries(list = []) {
                return list
                    .map(countryCode => this.findCountry(countryCode))
                    .filter(Boolean);
            },
            findCountry(iso = '') {
                return this.allCountries.find(country => country.iso2 === iso.toUpperCase());
            },
            getItemClass(index, iso2) {
                const highlighted = this.selectedIndex === index;
                const lastPreferred = index === this.preferredCountries.length - 1;
                const preferred = this.preferredCountries.some(c => c.toUpperCase() === iso2);
                return {
                    highlighted,
                    'last-preferred': lastPreferred,
                    preferred,
                };
            },
            choose(country) {
                this.activeCountry = country || this.activeCountry || {};
                if (this.phone
                    && this.phone[0] === '+'
                    && this.activeCountry.iso2
                    && this.phoneObject.number.national) {
                    // Attach the current phone number with the newly selected country
                    this.phone = PhoneNumber(this.phoneObject.number.national, this.activeCountry.iso2)
                        .getNumber('international');
                } else if (this.inputOptions && this.inputOptions.showDialCode && country) {
                    // Reset phone if the showDialCode is set
                    this.phone = `+${country.dialCode}`;
                }
                this.$emit('input', this.phoneObject.number[this.parsedMode], this.phoneObject);
                this.$emit('onInput', this.phoneObject); // Deprecated
            },
            testCharacters() {
                const re = /^[()\-+0-9\s]*$/;
                return re.test(this.phone);
            },
            onInput() {
                if (this.validCharactersOnly && !this.testCharacters()) {
                    return;
                }
                this.$refs.input.setCustomValidity(this.phoneObject.valid ? '' : this.invalidMsg);
                // Returns response.number to assign it to v-model (if being used)
                // Returns full response for cases @input is used
                // and parent wants to return the whole response.
                this.$emit('input', this.phoneObject.number[this.parsedMode], this.phoneObject);
                this.$emit('onInput', this.phoneObject); // Deprecated
            },
            onBlur() {
                this.$emit('blur');
                this.$emit('onBlur'); // Deprecated
            },
            onEnter() {
                this.$emit('enter');
                this.$emit('onEnter'); // Deprecated
            },
            onSpace() {
                this.$emit('space');
                this.$emit('onSpace'); // Deprecated
            },
            focus() {
                this.$refs.input.focus();
            },
            toggleDropdown() {
                if (this.disabled) {
                    return;
                }
                this.broadcast('Drop', 'on-update-popper');
                this.open = !this.open;
            },
            clickedOutside() {
                this.open = false;
            },
            keyboardNav(e) {
                if (e.keyCode === 40) {
                    // down arrow
                    e.preventDefault();
                    this.open = true;
                    if (this.selectedIndex === null) {
                        this.selectedIndex = 0;
                    } else {
                        this.selectedIndex = Math.min(this.sortedCountries.length - 1, this.selectedIndex + 1);
                    }
                    const selEle = this.$refs.list.children[this.selectedIndex];
                    if (selEle.offsetTop + selEle.clientHeight
                        > this.$refs.list.scrollTop + this.$refs.list.clientHeight) {
                        this.$refs.list.scrollTop = selEle.offsetTop
                            - this.$refs.list.clientHeight
                            + selEle.clientHeight;
                    }
                } else if (e.keyCode === 38) {
                    // up arrow
                    e.preventDefault();
                    this.open = true;
                    if (this.selectedIndex === null) {
                        this.selectedIndex = this.sortedCountries.length - 1;
                    } else {
                        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
                    }
                    const selEle = this.$refs.list.children[this.selectedIndex];
                    if (selEle.offsetTop < this.$refs.list.scrollTop) {
                        this.$refs.list.scrollTop = selEle.offsetTop;
                    }
                } else if (e.keyCode === 13) {
                    // enter key
                    if (this.selectedIndex !== null) {
                        this.choose(this.sortedCountries[this.selectedIndex]);
                    }
                    this.open = !this.open;
                } else {
                    // typing a country's name
                    this.typeToFindInput += e.key;
                    clearTimeout(this.typeToFindTimer);
                    this.typeToFindTimer = setTimeout(() => {
                        this.typeToFindInput = '';
                    }, 700);
                    // don't include preferred countries so we jump to the right place in the alphabet
                    const typedCountryI = this.sortedCountries
                        .slice(this.preferredCountries.length)
                        .findIndex(c => c.name.toLowerCase().startsWith(this.typeToFindInput));
                    if (typedCountryI >= 0) {
                        this.selectedIndex = this.preferredCountries.length + typedCountryI;
                        const selEle = this.$refs.list.children[this.selectedIndex];
                        const needToScrollTop = selEle.offsetTop < this.$refs.list.scrollTop;
                        const needToScrollBottom = selEle.offsetTop + selEle.clientHeight
                            > this.$refs.list.scrollTop + this.$refs.list.clientHeight;
                        if (needToScrollTop || needToScrollBottom) {
                            this.$refs.list.scrollTop = selEle.offsetTop - this.$refs.list.clientHeight / 2;
                        }
                    }
                }
            },
            reset() {
                this.selectedIndex = this.sortedCountries.map(c => c.iso2).indexOf(this.activeCountry.iso2);
                this.open = false;
            },
        },
    };
</script>

<style src="./sprite.css"></style>
<style lang="less" scoped>
    @color_1: #666;
    @background_color_1: #fff;
    @background_color_2: #f3f3f3;
    @border_color_1: #66afe9;

    li.last-preferred {
        border-bottom: 1px solid #cacaca;
    }
    .iti-flag {
        margin-right: 5px;
        margin-left: 5px;
    }
    .dropdown-item {
    .iti-flag {
        display: inline-block;
        margin-right: 5px;
    }
    cursor: pointer;
    padding: 4px 15px;
    }
    .selection {
        font-size: 0.8em;
        display: flex;
        align-items: center;
    }
    .tel-input {
        border-radius: 3px;
        display: flex;
        border: 1px solid #bbb;
        text-align: left;
    &:focus-within {
         box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
         border-color: @border_color_1;
     }
    }
    input {
        border: none;
        border-radius: 0 2px 2px 0;
        width: 100%;
        outline: none;
        padding-left: 7px;
    }
    ul {
        z-index: 1;
        padding: 0;
        margin: 0;
        text-align: left;
        list-style: none;
        max-height: 200px;
        overflow-y: scroll;
        position: absolute;
        top: 33px;
        left: -1px;
        background-color: @background_color_1;
        border: 1px solid #ccc;
        width: 390px;
    }
    .dropdown {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        position: relative;
        padding: 7px;
        cursor: pointer;
    &:hover {
         background-color: @background_color_2;
     }
    }
    .dropdown.open {
        background-color: @background_color_2;
    }
    .country-code {
        color: @color_1;
    }
    .dropdown-arrow {
        transform: scaleY(0.5);
        display: inline-block;
        color: @color_1;
    }
    .dropdown-item.highlighted {
        background-color: @background_color_2;
    }
    .dropdown-menu.show {
        max-height: 300px;
        overflow: scroll;
    }
    .tel-input.disabled {
    .selection {
        cursor: no-drop;
    }
    .dropdown {
        cursor: no-drop;
    }
    input {
        cursor: no-drop;
    }
    }
</style>