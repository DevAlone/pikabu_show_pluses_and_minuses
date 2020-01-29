const processNode = (node) => {
    const label = node.getAttribute("aria-label");
    if (label === null
            || label.toLowerCase().startsWith("рейтинг скрыт")
            || label.toLowerCase().startsWith("нет данных")) {
        // some comments like "the comment of a day" don't have info about pluses and minuses
        // also skip hidden rating
        return;
    }

    try {
        let [_, number_of_pluses, number_of_minuses] = label.match(/^(\-?\d+).+?(\-?\d+).*$/);
        number_of_minuses = Number(number_of_minuses);
        number_of_pluses = Number(number_of_pluses);
        let rating = Number(node.textContent.match(/\-?\d+/)[0]);
        console.log(number_of_pluses, number_of_minuses, rating);

        if (number_of_pluses - number_of_minuses != rating || number_of_minuses > 0 && number_of_pluses > 0) {
            let items = [
                `<span>${rating} </span>`,
                `<span>(</span>`,
                `<span class="u_6d552f21686a_pikabu_show_pluses_and_minuses__number_of_pluses">${number_of_pluses}</span>`,
                `<span> - </span>`,
                `<span class="u_6d552f21686a_pikabu_show_pluses_and_minuses__number_of_minuses">${number_of_minuses}</span>`,
                `<span>)</span>`,
            ];
            node.innerHTML = items.join("");
        }
    } catch(err) {
        console.log("error during parsing comment's rating");
        console.log(err);
    }
};

const processNodes = (baseNode) => {
    if ("querySelectorAll" in baseNode) {
        for (let node of baseNode.querySelectorAll(".comment__rating-count")) {
            processNode(node);
        }
    }
};

const callback = (mutations) => {
    for (let mutation of mutations) {
        for (let base of mutation.addedNodes) {
            processNodes(base);
        }
    }
};

const observer = new MutationObserver(callback);

const main = () => {
    processNodes(document);

    observer.observe(document, {
        childList: true,
        subtree: true,
    });
};

main();
