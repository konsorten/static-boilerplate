/**
 * Print out text in console
 *
 * @param {string}  a   - Text part 1
 * @param {string}  b   - Text part 2
 * @returns {string}
 */
function test(a: string, b: string): string {
    return `Test: ${a} and ${b}`;
}

// tslint:disable-next-line:no-console
console.log(test("yo", "bro"));
