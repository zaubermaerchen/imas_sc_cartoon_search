<template>
    <section>
        <searchform v-bind:title="title" v-bind:start_at="start_at" v-bind:end_at="end_at" v-bind:characters="characters"></searchform>
        <result v-for="result in results" v-bind:data="result"></result>
        <pager v-bind:count="count" v-bind:limit="limit" @change="changePage"></pager>
    </section>
</template>


<script lang="ts">
    import searchform from './components/search_form.vue';
    import result from './components/search_result.vue';
    import pager from './components/pager.vue';

    function getCurrentDate(): string {
        var now: Date  = new Date();
        var date: string = now.getFullYear() + "-";
        date += ("0" + (now.getMonth() + 1)).slice(-2) + "-";
        date += ("0" + now.getDate()).slice(-2);
        return date
    }

    export default {
        components: {
            "searchform": searchform,
            "result": result,
            "pager": pager
        },
        data: function () {
            return {
                title: "",
                start_at: "2011-11-28",
                end_at: getCurrentDate(),
                characters: [],
                results: [],
                count: 0,
                limit: 10
            };
        },
        mounted: function (): void {
            this.setParameters();
            this.getResults();
        },
        methods: {
            setParameters: function(): void {
                const parameters: URLSearchParams = new URLSearchParams(window.location.search);
                if(parameters.has("title")) {
                    this.title = decodeURIComponent(parameters.get("title").replace(/\+/g, " ");
                }
                if(parameters.has("start_at")) {
                    this.start_at = parameters.get("start_at");
                }
                if(parameters.has("end_at")) {
                    this.end_at = parameters.get("end_at");
                }
                if(parameters.has("character")) {
                    this.characters = parameters.getAll("character");
                }
            },
            getResults(offset: number = 0) {
                const url = new URL("https://www.zaubermaerchen.info/imas_sc/api/cartoon/search/");
                if(this.title.length > 0) {
                    url.searchParams.append("title", this.title);
                }
                for(let i = 0; i < this.characters.length; i++) {
                    url.searchParams.append("character", this.characters[i]);
                }
                url.searchParams.append("start_at", this.start_at);
                url.searchParams.append("end_at", this.end_at);
                url.searchParams.append("offset", offset.toString());

                fetch(url.href, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                    //body: data,
                    mode: "cors",
                    credentials: "omit"
                }).then((response) => {
                    return response.json();
                }).then((json) => {
                    this.count = json.count;
                    this.results = json.results;
                })
            },
            changePage: function(offset: number): void {
                this.getResults(offset);
            }
        }
    }
</script>

<style>
    body {
        font-size: 80%;
    }
</style>