function On_Start() {
    Clicked_Generate_Password()
    Clicked_Random_Number_Generator()
}
On_Start()
/*
Password Generator.
*/
function Clicked_Generate_Password() {
    const Password_Length = document.getElementById("Password_Length")
    const Password_Output = document.getElementById("Password_Output")

    const toggles = {
        Symbols: document.getElementById("P_Symbols").checked,
        Lower: document.getElementById("P_Lower").checked,
        Upper: document.getElementById("P_Capitals").checked,
        Numbers: document.getElementById("P_Numbers").checked, 
    }
    if (!Object.values(toggles).includes(true)) {
        console.error("All characters excluded!")
        return
    }
    
    const length = Password_Length.value
    if (length < 1) {
        console.error("Length less than 1!")
        return
    }

    const password = Generate_Password(length, toggles)
    Password_Output.value = password
}
function Generate_Password(length, toggles) {
    const password = []
    for (let key = 0; key < length; key ++) {
        password[key] = Generate_Character(toggles)
    }
    const Password_String = password.join("")
    return Password_String
}
function Generate_Character(toggles) {
    let rand = Math.floor((Math.random() * (126 + 1 - 33)) + 33)
    while (!Accepted_Unicode(rand, toggles)) {
        rand = Math.floor((Math.random() * (126 + 1 - 33)) + 33)
    }
    const char = String.fromCharCode(rand)
    return char
}
function Accepted_Unicode(num, toggles) {
    /*
    https://www.rapidtables.com/code/text/unicode-characters.html
    if (toggles & 0b0001) -> include Symbols -> (33 - 47, 58 - 64, 91 - 96, 123 - 126) INCLUSIVE
    if (toggles & 0b0010) -> include Lower -> (97 - 122) INCLUSIVE
    if (toggles & 0b0100) -> include Capital -> (65 - 90) INCLUSIVE
    if (toggles & 0b1000) -> include Numbers -> (48, 57) INCLUSIVE
    */
    if (num <= 32 || num >= 127) {
        return false
    }
    if (!(toggles.Symbols)) {
        if (num <= 47 || (num >= 58 && num <= 64) || (num >= 91 && num <= 96) || (num >= 123 && num <= 126)) {
            return false
        }
    }
    if (!(toggles.Lower)) {
        if (num >= 97 && num <= 122) {
            return false
        }
    }
    if (!(toggles.Upper)) {
        if (num >= 65 && num <= 90) {
            return false
        }
    }
    if (!(toggles.Numbers)) {
        if (num >= 48 && num <= 57) {
            return false
        }
    }
    return true
}
function Copy_Password() {
    const Password_Output = document.getElementById("Password_Output")
    const password = Password_Output.value
    navigator.clipboard.writeText(password)
}
/*
Random Number Generator.
planned: 
-- base?
-- Distribution?
*/
function Clicked_Random_Number_Generator() {
    const Random_Number_Min = document.getElementById("Random_Number_Min")
    const Random_Number_Max = document.getElementById("Random_Number_Max")
    const Random_Number_Output = document.getElementById("RN_Output")
    
    const min = parseFloat(Random_Number_Min.value)
    const max = parseFloat(Random_Number_Max.value)
    
    const number = Generate_Random_Number(min, max)
    Random_Number_Output.value = number
}
function Generate_Random_Number(min, max) {
    const Inclusive_Max = true
    const range = (max+Inclusive_Max) - min
    return Math.floor(Math.random()*range + min)
}
/*
Base Converter.
*/

/*
Probability Distributions.
*/
/*
Stopwatch.
*/

/*
Timer.
*/