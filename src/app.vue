<template>
    <section>
        <el-form ref="form" label-position="right" label-width="150px">
            <el-form-item label="タイトル">
                <el-input v-model="title" name="title" placeholder="タイトル"></el-input>
            </el-form-item>
            <el-form-item label="公開日">
                <el-date-picker v-model="start_at" name="start_at" type="date" placeholder="検索対象開始日"></el-date-picker> 〜
                <el-date-picker v-model="end_at" name="end_at" type="date" placeholder="検索対象終了日"></el-date-picker>
            </el-form-item>
            <el-form-item label="登場キャラクター">
                <el-select v-model="characters" multiple filterable no-match-text="見つかりません" placeholder="登場キャラクター">
                    <el-option v-for="name in target_characters" :key="name" :label="name" :value="name"></el-option>
                </el-select>
                <input type="hidden" name="character" v-for="character in characters" v-bind:value="character" />
            </el-form-item>
            <el-button type="primary" native-type="submit">検索</el-button>
        </el-form>

        <el-pagination background layout="prev, pager, next" v-on:current-change="changePage" v-bind:total="count" v-bind:current-page.sync="page" v-bind:page-size="limit"></el-pagination>

        <el-container v-for="result in results" class="result">
            <el-aside>
                <a v-bind:href="getImageUrl(result.type, result.image_hash)">
                    <img width="264" height="196" v-bind:src="getThumbnailImageUrl(result.id, result.thumbnail_hash)" v-bind:alt="result.title" />
                </a>
            </el-aside>
            <el-container>
                <el-header>
                    <a v-bind:href="getUrl(result.id, result.thumbnail_hash)">
                        {{ getEpisodeType(result.type)}}第{{ result.episode }}話 「{{ result.title }}」
                    </a>
                    <a class="tweet" v-if="getTweetUrl(result.tweet_id) != null" v-bind:href="getTweetUrl(result.tweet_id)">
                        <img src="./images/twitter.png" width="14" height="14" />
                    </a>
                </el-header>
                <el-main>
                    <h2>公開日</h2>
                    <p>{{ result.release_date }}</p>

                    <h2>登場キャラクター</h2>
                    <ul>
                        <li v-for="name in result.characters"><a v-bind:href="'?character=' + name">{{ name }}</a></li>
                    </ul>
                </el-main>
            </el-container>
        </el-container>

        <el-pagination background layout="prev, pager, next" v-on:current-change="changePage" v-bind:total="count" v-bind:current-page.sync="page" v-bind:page-size="limit"></el-pagination>
    </section>
</template>


<script lang="ts">
    import * as api from './components/api.ts';

    function getCurrentDate(): string {
        var now: Date  = new Date();
        var date: string = now.getFullYear() + "-";
        date += ("0" + (now.getMonth() + 1)).slice(-2) + "-";
        date += ("0" + now.getDate()).slice(-2);
        return date
    }

    export default {
        data: function () {
            return {
                title: "",
                start_at: "2018-02-08",
                end_at: getCurrentDate(),
                characters: [],
                results: [],
                count: 0,
                page: 1,
                limit: 10,
                target_characters: [],
            };
        },
        mounted: function (): void {
            this.setParameters();
            this.getResults();
            api.getCharacterNameList().then((json: any) => {
                this.target_characters = json.map((character: any) => {
                    return character.name;
                });
            });
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
                const title = this.title.length > 0 ? this.title : null;
                const start_at = this.start_at.length > 0 ? this.start_at : null;
                const end_at = this.end_at.length > 0 ? this.end_at.title : null;
                api.searchCartoon(title, this.characters, start_at, end_at, this.limit, offset).then((json: any) => {
                    this.count = json.count;
                    this.results = json.results;
                });
            },
            changePage: function(page: number): void {
                this.page = page;
                this.getResults((page - 1) * this.limit);
            },
            getEpisodeType(type: number): string {
                switch(type) {
                    case 1:
                        return "特別編";
                    case 2:
                        return "限定";
                    default:
                        return "";
                }
            },
            getUrl(id: number, hash: string | null): string {
                if (hash != null) {
                    return "https://shinycolors.enza.fun/comic/" + id;
                } else {
                    return null;
                }
            },
            getAssetsUrl: function(hash: string): string {
                return "https://shinycolors.enza.fun/assets/" + hash;
            },
            getThumbnailImageUrl: function(id: number, hash: string | null): string {
                if (hash != null) {
                    return this.getAssetsUrl(hash);
                } else {
                    return "./images/blank.jpg"
                }
            },
            getImageUrl(type: number, hash: string | null): string {
                if (!this.isLimitedEpisode(type) && hash != null) {
                    return this.getAssetsUrl(hash);
                } else {
                    return null;
                }
            },
            getTweetUrl(tweet_id :number | null): string {
                if (tweet_id != null) {
                    return "https://twitter.com/imassc_official/status/" + tweet_id;
                } else {
                    return null;
                }
            },
            isLimitedEpisode(type: number): boolean {
                return type == 2;
            }
        }
    }
</script>

<style>
    body {
        font-size: 80%;
    }
    .el-form {
        margin-bottom: 1em;
    }
    .el-select {
        width: 100%;
    }
    .el-pagination {
        display: flex;
        justify-content: center;
    }

    .result {
        margin: 1em 0;
        display: -webkit-box;
        display: flex;
        align-items: center;
    }

    .result > .el-container  {
        margin: 0 0.25em;
        padding: 5px;
        background-color: #eeeeee;
        border-radius: 0.5em;
    }
    .result > .el-container > *  {
        padding: 0;
    }
    .result > .el-container > .el-header {
        font-size: 120%;
        font-weight: bold;
        margin: 0 0 0.5em 0;
        height: auto!important;
    }
    .result > .el-container > .el-header > .tweet {
        margin-left: 0.5em;
    }
    .result > .el-container > .el-main > h2 {
        font-size: 100%;
        margin: 0;
    }
    .result > .el-container > .el-main > p, 
    .result > .el-container > .el-main > ul {
        margin: 0 0 0.5em 0;
        padding: 5px;
        background-color: #ccccff;
        border-radius: 0.5em;
    }
    .result > .el-container > .el-main > ul {
        display: -webkit-box;
        display: flex;
        flex-wrap: wrap;
    }
    .result > .el-container > .el-main > ul > li {
        list-style-type: none;
        display: inline;
        padding-right: 0.5em;
    }
</style>