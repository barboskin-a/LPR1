let eventBus = new Vue();
let product = "Socks";

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
     <div class="product">
         <div class="product-image">
             <img :src="image" :alt="altText"/>
         </div>
         <div class="product-info">
             <h1>{{ title }}</h1>
             <p v-if="inStock">In stock</p>
             <p v-else>Out of Stock</p>
             
             <info-tabs :shipping="shipping" 
             :details="details"></info-tabs>
 
             <div class="color-box"
             v-for="(variant, index) in variants"
             :key="variant.variantId"
             :style="{ backgroundColor:variant.variantColor }"
             @mouseover="updateProduct(index)">
             </div>    
                 
             <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>

         </div>
         <product-tabs :reviews="reviews"></product-tabs>
     </div>
     `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            reviews: [],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        });
    }
})

Vue.component('product-review', {
    template: `
     <form class="review-form" @submit.prevent="onSubmit">
         <p v-if="errors.length">
             <b>Please correct the following error(s):</b>
             <ul>
                 <li v-for="error in errors">{{ error }}</li>
             </ul>
         </p>
 
         <p>
             <label for="name">Name:</label>
             <input id="name" v-model="name" placeholder="name">
         </p>
         <p>
             <label for="review">Review:</label>
             <textarea id="review" v-model="review"></textarea>
         </p>
         <p>
             <label for="rating">Rating:</label>
             <select id="rating" v-model.number="rating">
                 <option>5</option>
                 <option>4</option>
                 <option>3</option>
                 <option>2</option>
                 <option>1</option>
             </select>
         </p>
         <p>Would you recommend this product?</p>
            <label>
                Yes
                <input type="radio" value="Yes" v-model="recommend"/>
            </label>
            <label>
                No
                <input type="radio" value="No" v-model="recommend"/>
            </label>
         </p>
         <p>
             <input type="submit" value="Submit">
         </p>
     </form>
     `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview);
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommend required.")
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
        <div>
            <ul>
                <span class="tab"
                    :class="{ activeTab: selectedTab === tab }"
                    v-for="(tab, index) in tabs"
                    @click="selectedTab = tab"
                >{{ tab }}</span>
            </ul>
            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>
            <div v-show="selectedTab === 'Make a Review'">
                <product-review @review-submitted="addReview"></product-review>
            </div>
        </div>
`,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})


Vue.component('info-tabs', {
    props: {
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <ul>
        <span class="tabs" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Shipping'">
                <p>{{ shipping }}</p>
        </div>
        <div v-show="selectedTab === 'Details'">
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
    </div>
    `,
    data() {
        return {
            tabs: ['Shipping', 'Details'],
            selectedTab: 'Shipping'
        }
    }
})


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
    }
})

