function on_start() {
    clicked_generate_password()
    clicked_random_number_generator()
}
on_start()
/*
Password Generator.
*/
function clicked_generate_password() {
    const password_length = document.getElementById("password_length")
    const password_output = document.getElementById("password_output")

    const toggles = {
        symbols: document.getElementById("password_symbols").checked,
        lower: document.getElementById("password_lower").checked,
        upper: document.getElementById("password_capitals").checked,
        numbers: document.getElementById("password_numbers").checked, 
    }
    let errors = ""
    if (!Object.values(toggles).includes(true)) {
        errors += "All Characters Excluded!\n"
    }
    
    const length = parseFloat(password_length.value)
    if (length < 1) {
        errors += "Length less than 1!\n"
    } else if (isNaN(length)) {
        errors += "Not a Valid Length!\n"
    }

    if (errors !== "") {
        console.error(errors)
        return
    }

    const password = generate_password(length, toggles)
    password_output.value = password
}
function generate_password(length, toggles) {
    const password = []
    for (let key = 0; key < length; key ++) {
        password[key] = generate_character(toggles)
    }
    const password_string = password.join("")
    return password_string
}
function generate_character(toggles) {
    let random_number = Math.floor((Math.random() * (126 + 1 - 33)) + 33)
    while (!accepted_unicode(random_number, toggles)) {
        random_number = Math.floor((Math.random() * (126 + 1 - 33)) + 33)
    }
    const char = String.fromCharCode(random_number)
    return char
}
function accepted_unicode(number, toggles) {
    /*
    https://www.rapidtables.com/code/text/unicode-characters.html
    if (toggles & 0b0001) -> include Symbols -> (33 - 47, 58 - 64, 91 - 96, 123 - 126) INCLUSIVE
    if (toggles & 0b0010) -> include Lower -> (97 - 122) INCLUSIVE
    if (toggles & 0b0100) -> include Capital -> (65 - 90) INCLUSIVE
    if (toggles & 0b1000) -> include Numbers -> (48, 57) INCLUSIVE
    */
    if (number <= 32 || number >= 127) {
        return false
    }
    if (!(toggles.symbols)) {
        if (number <= 47 || (number >= 58 && number <= 64) || (number >= 91 && number <= 96) || (number >= 123 && number <= 126)) {
            return false
        }
    }
    if (!(toggles.lower)) {
        if (number >= 97 && number <= 122) {
            return false
        }
    }
    if (!(toggles.upper)) {
        if (number >= 65 && number <= 90) {
            return false
        }
    }
    if (!(toggles.numbers)) {
        if (number >= 48 && number <= 57) {
            return false
        }
    }
    return true
}
function copy_password() {
    const password_output = document.getElementById("password_output")
    const password = password_output.value
    navigator.clipboard.writeText(password)
}
/*
Random Number Generator.
planned: 
-- base?
-- Distribution?
*/
function clicked_random_number_generator() {
    const random_number_min = document.getElementById("random_number_min")
    const random_number_max = document.getElementById("random_number_max")
    const random_number_output = document.getElementById("random_number_output")
    
    const min = parseFloat(random_number_min.value)
    const max = parseFloat(random_number_max.value)

    let errors = ""
    if (isNaN(min)) {
        errors += "No Valid Minimum Number In Input!\n"
    }
    if (isNaN(max)) {
        errors += "No Valid Maximum Number In Input!\n"
    }

    if (min > max) {
        errors += "Minimum Greater than Maximum!\n"
    }

    if (errors !== "") {
        console.error(errors)
        return
    }
    
    const number = generate_random_number(min, max)
    random_number_output.value = number
}
function generate_random_number(min, max) {
    const inclusive_max = true
    const range = (max+inclusive_max) - min
    return Math.floor(Math.random()*range + min)
}
/*
Base Converter.
*/
function clicked_base_converter() {
    const base_converter_number = document.getElementById("base_converter_number")
    const base_converter_old_base = document.getElementById("base_converter_old_base")
    const base_converter_new_base = document.getElementById("base_converter_new_base")
    const base_converter_output = document.getElementById("base_converter_output")

    const number = base_converter_number.value
    const old_base = parseFloat(base_converter_old_base.value)
    const new_base = parseFloat(base_converter_new_base.value)
    
    let errors = "\n"

    if (number === "") {
        errors += "Number is empty!\n"
    }
    if (old_base < 1) {
        errors += "Old Base less than 1!\n"
    } else if (isNaN(old_base)) {
        errors += "Not a Valid Number in Old Base!\n"
    }
    if (new_base < 1) {
        errors += "New Base less than 1!\n"
    } else if (new_base > 62) {
        errors += "New Base greater than 62!\n-- Cannot guarantee integrity since algorithm cannot represent 62\n"
    } else if (isNaN(new_base)) {
        errors += "Not a Valid Number in New Base!\n"
    }
    const character_map = generate_character_map()
    for (let num of Object.values(number)) {
        if (character_map[num] >= old_base) {
            errors += "Number does not Satisfy Input Base!\n"
        }
    }

    if (errors !== "\n") {
        console.error(errors)
        return
    }
    let new_number = "0"
    if (!(number === "0")) {
        new_number = convert_base(number, old_base, new_base)
    }
    base_converter_output.value = new_number
}
function convert_base(number, old_base, new_base) {
    // 2 step process
    // - convert from old base to denary
    // - convert from denary to new base
    const number_array = Object.values(number)
    const character_map = generate_character_map()
    let placement_offset = number_array.length-1
    let base10_equivalent = 0
    for (let placement = 0; placement < number_array.length; placement++) {
        base10_equivalent += character_map[number_array[placement]] * old_base**(placement_offset--)
    }

    const character_map_inverse = generate_character_map_inverse()
    const new_number_array = []
    const log_new_base = Math.log(new_base)
    while (base10_equivalent > 0) {
        // let new_temp_number = base10_equivalent
        // let new_position = -1
        // while(new_temp_number > 0) {
        //     new_temp_number = Math.floor(new_temp_number / new_base)
        //     new_position++
        // }
        
        // log base n
        const new_position = Math.floor(Math.log(base10_equivalent) / log_new_base)

        const magnitude = new_base**new_position
        const bit = Math.floor(base10_equivalent / magnitude)
        new_number_array[new_position] = character_map_inverse[bit]

        base10_equivalent -= bit * magnitude
    }

    let new_number = ""
    // Empty Items from skipping "magnitudes"
    for (let num of new_number_array.reverse()) {
        if (num) {
            new_number += num
        } else {
            new_number += "0"
        }
    }
    return new_number
}
function generate_character_map() {
    const characters_map = {
        "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
        "A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15, "G": 16, "H": 17, "I": 18, "J": 19, "K": 20, "L": 21, "M": 22, "N": 23, "O": 24, "P": 25, "Q": 26, "R": 27, "S": 28, "T": 29, "U": 30, "V": 31, "W": 32, "X": 33, "Y": 34, "Z": 35,
        "a": 36, "b": 37, "c": 38, "d": 39, "e": 40, "f": 41, "g": 42, "h": 43, "i": 44, "j": 45, "k": 46, "l": 47, "m": 48, "n": 49, "o": 50, "p": 51, "q": 52, "r": 53, "s": 54, "t": 55, "u": 56, "v": 57, "w": 58, "x": 59, "y": 60, "z": 61
    }
    return characters_map
}
function generate_character_map_inverse() {
    const character_map = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ]
    return character_map
}
function test_convert_base() {
    console.log("Running test_convert_base\nExpected 8 true")
    console.log(convert_base("10F", 16, 12) === "1A7") // High base -> Low base
    console.log(convert_base("1010", 2, 10) === "10") // Low base -> High base
    console.log(convert_base("255", 10, 16) === "FF") // Edge Case
    console.log(convert_base("1A7", 12, 2) === "100001111") // Lots of empty spaces
    console.log(convert_base("12345", 10, 36) === "9IX") // base limit (include lower letters)
    console.log(convert_base("9IX", 36, 10) === "12345") // other way
    console.log(convert_base("Zz", 62, 63) === "ZQ") // Upper limits
    console.log(convert_base("98765", 10, 61) === "QX6") // Upper limits
}

/*
Probability Distributions.
*/
/*
Word counter (clipboard)
*/
function clicked_word_counter() {
    if (!navigator.clipboard.readText) {
        const optional_word_counter_input = document.getElementById("optional_word_counter_input")
        const text = optional_word_counter_input.value
        count_and_output(text)
        return
    }
    const b = read_clipboard().then(text => count_and_output(text))
}
async function read_clipboard() {
    return await navigator.clipboard.readText()
}
function count_and_output(text) {
    const word_counter_output = document.getElementById("word_counter_output")
    const word_count = text.split(" ").filter(x => x !== "").length
    word_counter_output.value = word_count
}