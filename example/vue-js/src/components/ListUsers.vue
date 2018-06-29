<template>
    <div>
        <div>
            <button @click="load(1)">Load page 1</button>
            <button @click="load(2)">Load page 2</button>
            <button @click="load()">Load error</button>
        </div>
        <ul>
            <li v-for="user in users" :key="user.id">{{`${user.first_name} ${user.last_name}`}}</li>
        </ul>
    </div>
</template>

<script>
	export default {
		name: 'list-users',
		data() {
			return {
				users: [],
			}
		},
		mounted() {
			this.load(1)
		},
		methods: {
			load(page) {
				const url = page === undefined ?
                  'https://reqres.in/api/unknown/23' :
                  `https://reqres.in/api/users?page=${page}`
				this.$axios
					.handle(errors => {
						console.log(errors)
					})
					.get(url)
					.then(response => {
						this.users = response.data.data
					})
			}
		}

	}
</script>