/**
 * @param settings {{colors, autoRun, cascade, specialClass}}
 * @type {{run, autoRun}}
 */
const varDumpModalTools = (settings) => {
    const COLORS = settings.colors
    const AUTO_RUN = settings.autoRun
    const CASCADE = settings.cascade
    const SPECIAL_CLASS = settings.specialClass
    const collapsingTools = varDumpCollapsingTools(CASCADE, SPECIAL_CLASS)
    const parsingTools = varDumpParsingTools()
    const displayGenerationTools = varDumpGenerationTools()

    function openVarDump() {
        return "<div class='"+SPECIAL_CLASS+"'>"
    }

    function closeVarDump() {
        return "</div>";
    }

    function openModalHTML() {
        return openVarDump() + "<div class='var_dump_modal'>";
    }

    function closeModalHTML() {
        return "</div>" + closeVarDump();
    }

    function failedHeaderHTML(dump) {
        var body = encodeURIComponent(dump);
        body = body.replace(/'/g, "%27");

        return "<div id='header'>" +
            "<div class='closeModal'><img class='svgIcon' src='" + chrome.extension.getURL("images/cross-mark-on-a-black-circle-background.svg") + "'></div>" +
            "</div>" +
            "<div class='failedMessage'>We were not able to parse this var_dump. If this is a valid var_dump, please " +
            "<a href='mailto:varmasterpiece@gmail.com?subject=Parsing%20Error&body=" + body + "'>notify us</a> so we can get this fixed!" +
            "</div>";
    }

    function headerHTML() {
        return "<div id='header'>" +
            "<div id='expandAll'><img class='svgIcon' src='" + chrome.extension.getURL("images/chevron-sign-down.svg") + "'> Expand All </div>" +
            "<div id='collapseAll'><img class='svgIcon rotate180' src='" + chrome.extension.getURL("images/chevron-sign-down.svg") + "'> Collapse All </div>" +
            "<div class='closeModal'><img class='svgIcon' src='" + chrome.extension.getURL("images/cross-mark-on-a-black-circle-background.svg") + "'></div>" +
            "</div>";
    }

    function getColorVal(color) {
        if(color === undefined) {
            return "inherit";
        } else {
            return color;
        }
    }

    function generateInlineStyles() {
        return '' +
            '<style class="VAR_DUMP-DEADBEEF" type="text/css">' +
            '.VAR_DUMP-DEADBEEF #var_dump .bool 	{ color:' + getColorVal(COLORS["bool"]) + 	'; } \n' +
            '.VAR_DUMP-DEADBEEF #var_dump .int 	{ color:' + getColorVal(COLORS["int"]) + 	'; } \n' +
            '.VAR_DUMP-DEADBEEF #var_dump .float { color:' + getColorVal(COLORS["float"]) + 	'; } \n' +
            '.VAR_DUMP-DEADBEEF #var_dump .null 	{ color:' + getColorVal(COLORS["null"]) + 	'; } \n' +
            '.VAR_DUMP-DEADBEEF #var_dump .array { color:' + getColorVal(COLORS["array"]) + 	'; } \n' +
            '.VAR_DUMP-DEADBEEF #var_dump .object { color:' + getColorVal(COLORS["object"]) + '; } \n' +
            '.VAR_DUMP-DEADBEEF #var_dump .string { color:' + getColorVal(COLORS["string"]) + '; } \n' +
            '</style>'
    }

    /**
     * Given var dump text, this will create a modal with the var dump
     * tree inside.
     *
     * Dump contains the text of the var dump
     */
    function printModalTree(varDumpObject, explicit) {
        var $body = $('body')
        var modalOpen = openModalHTML();
        var modalClose = closeModalHTML();

        if(varDumpObject == null || varDumpObject == undefined) {
            //the user tied to prettify a var dump, and we failed to parse it. Take Plan 2
            var failedHeader = failedHeaderHTML(dump);
            $body.append(modalOpen + failedHeader + "<pre>" + dump + "</pre>" + modalClose);
            addCloseListener();
            return;
        }

        //generate our header
        var header = headerHTML();

        //add out html / styles / listeners to the page
        $body.append(generateInlineStyles());
        $body.append(modalOpen + header + displayGenerationTools.getVarDumpHtml(varDumpObject) + modalClose);
        collapsingTools.addListeners();
    }

    function bootstrap_vardump() {
        const varDumpObj = parsingTools.parseVarDumpFromPage()

        //If we think that the whole page is a var dump
        if(varDumpObj !== undefined && varDumpObj !== null) {
            printModalTree(varDumpObj);
        }
    }

    function run() {
        const varDumpObj = parsingTools.parseVarDumpFromSelection()
        printModalTree(varDumpObj);
    }

    return {
        run: run,
        autoRun: bootstrap_vardump
    }
}