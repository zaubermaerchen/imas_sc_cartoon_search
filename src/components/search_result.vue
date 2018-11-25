<template>
    <div class="result">
        <div class="thumbnail">
            <img width="264" height="196" v-bind:src="getThumbnailImageUrl()" v-bind:alt="getTitle()" />
        </div>
        <div class="detail">
            <h1>
                <a v-bind:href="getUrl()">
                    {{ getEpisodeType()}}第{{ getEpisode() }}話 「{{ getTitle() }}」
                </a>
            </h1>

            <h2>公開日</h2>
            <p>{{ getReleaseDate() }}</p>

            <h2>登場キャラクター</h2>
            <ul class="characters">
                <li v-for="name in getCharacters()"><a v-bind:href="'?character=' + name">{{ name }}</a></li>
            </ul>

            <p v-if="!isLimitedEpisode()">
                <a v-if="getTweetUrl() != null" v-bind:href="getTweetUrl()">ツイートURL</a>
                <a v-if="getImageUrl() != null" v-bind:href="getImageUrl()">画像URL</a>
            </p>

        </div>
    </div>
</template>

<script lang="ts">
    function getAssetsUrl(hash: string): string {
        return "https://shinycolors.enza.fun/assets/" + hash;
    }

    export default {
        props: [
            "data"
        ],
        methods: {
            getEpisodeType(): string {
                switch(parseInt(this.data.type)) {
                    case 1:
                        return "特別編";
                    case 2:
                        return "限定";
                    default:
                        return "";
                }
            },
            getEpisode(): number {
                return parseInt(this.data.episode);
            },
            getReleaseDate(): String {
                return this.data.release_date;
            },
            getTitle(): String {
                return this.data.title;
            },
            getCharacters(): String[] {
                return this.data.characters;
            },
            getUrl(): string {
                if (this.data.thumbnail_hash != null) {
                    return "https://shinycolors.enza.fun/comic/" + this.data.id;
                } else {
                    return null;
                }
            },
            getThumbnailImageUrl(): string {
                if (this.data.thumbnail_hash != null) {
                    return getAssetsUrl(this.data.thumbnail_hash);
                } else {
                    return "./images/blank.jpg"
                }
            },
            getImageUrl(): string {
                if (this.data.type != 2 && this.data.image_hash != null) {
                    return getAssetsUrl(this.data.image_hash);
                } else {
                    return null;
                }
            },
            getTweetUrl(): string {
                if (this.data.tweet_id != null) {
                    return "https://twitter.com/imassc_official/status/" + this.data.tweet_id;
                } else {
                    return null;
                }
            },
            isLimitedEpisode(): boolean {
                return parseInt(this.data.type) == 2;
            }
        }
    };
</script>

<style scoped>
    .result {
        margin: 0 0 1em 0;
        display: -webkit-box;
        display: flex;
        align-items: center;
    }

    .result > .detail {
        margin: 0 0.25em;
        padding: 5px;
        background-color: #eeeeee;
        border-radius: 0.5em;
        -webkit-box-flex : 1;
        -webkit-box-ordinal-group : 2;
        -webkit-flex-grow: 0;
        flex-grow: 1;
        -webkit-order: 1;
        order: 1;
    }

    .result > .thumbnail {
        margin: 0 0.25em;
        -webkit-box-ordinal-group : 1;
        -webkit-order: 0;
        order: 0;
    }
    .result > .detail > h1 {
        font-size: 120%;
        margin: 0 0 0.5em 0;

    }
    .result > .detail > h2 {
        font-size: 100%;
        margin: 0;
    }
    .result > .detail > p {
        margin: 0 0 0.5em 0;
        padding: 5px;
        background-color: #ccccff;
        border-radius: 0.5em;
    }
    .result > .detail > ul.characters {
        display: -webkit-box;
        display: flex;
        flex-wrap: wrap;
        margin: 0 0 0.5em 0;
        padding: 5px;
        background-color: #ccccff;
        border-radius: 0.5em;
    }
    .result > .detail > ul.characters > li {
        list-style-type: none;
        display: inline;
        padding-right: 0.5em;
    }
</style>