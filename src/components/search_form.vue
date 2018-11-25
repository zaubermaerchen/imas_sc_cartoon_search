<template>
    <form method="get">
        <table>
            <tr>
                <th>タイトル</th>
                <td>
                    <input type="search" name="title" size="50" v-bind:value="title" />
                </td>
            </tr>
            <tr>
                <th>公開日</th>
                <td>
                    <input type="date" name="start_at" v-bind:value="start_at" /> 〜
                    <input type="date" name="end_at" v-bind:value="end_at" />
                </td>
            </tr>
            <tr>
                <th>登場キャラクター</th>
                <td>
                    <input type="hidden" name="character" v-for="character in selected_characters" v-bind:value="character" />
                    <v-select v-model="selected_characters" v-bind:options="character_names" multiple="multiple"></v-select>
                </td>
            </tr>
        </table>
        <p>
            <input type="submit" value="検索" />
        </p>
    </form>
</template>

<script lang="ts">
    import vSelect from "vue-select"


    export default {
        components: {
            "v-select": vSelect
        },
        data: function () {
            return {
                selected_characters: [],
                character_names: [],
            };
        },
        props: [
            "title",
            "start_at",
            "end_at",
            "characters",
        ],
        mounted: function (): void {
            fetch("https://www.zaubermaerchen.info/imas_sc/api/character/names/", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                mode: "cors",
                credentials: "omit"
            }).then((response) => {
                return response.json();
            }).then((json) => {
                this.character_names = json.map(function (character) {
                    return character.name;
                });
            })
        },
        watch: {
            characters: {
                handler(val: string[]) {
                    this.selected_characters = val;
                }
            }
        }
    }
</script>

<style scoped>
    input {
        border-radius: 3px;
        box-shadow: none;
        border: 1px solid #bbbbbb;
    }
    button {
        border-radius: 3px;
        box-shadow: none;
        border: 1px solid #bbbbbb;
    }
    input[name="title"] {
        padding: 0.5em 2px;
        width: 30em;
    }
    select#idols {
        width: 30em;
    }
    input[type="date"] {
        padding: 0.3em 2px;
    }
    input[type="submit"] {
        padding: 3px 5px;
    }
</style>