const readline = require('readline');
const fs = require('fs');

function isUsernameExists(username, inputFile) {
    let line;
    while ((line = inputFile.readline()) !== null) {
        const existingUsername = line.split(' ')[0];
        if (existingUsername === username) {
            return true;
        }
    }
    return false;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let choice, i = 0;
let text, oldpassword, password1, password2, pass, name, password0, user, word, word1, currentusername;
let creds = new Array(2), cp = new Array(2);

console.log("\t\t\tSecurity System\n\n");

rl.question("Enter your choice: ", (input) => {
    choice = parseInt(input);

    switch (choice) {
        case 1:
            console.log("\t\t\tRegister\n");
            rl.question("Please enter username: ", (input) => {
                name = input;

                const existingFile = fs.readFileSync("file.txt", 'utf8');
                if (isUsernameExists(name, existingFile)) {
                    console.log("Username already exists. Please choose a different username!\n");
                } else {
                    rl.question("Please enter password: ", (input) => {
                        password0 = input;

                        fs.writeFileSync("file.txt", `${name}\n${password0}\n`);
                        console.log("Registration successful\n\n");
                    });
                }
            });
            break;

        case 2:
            i = 0;
            console.log("\t\t\tLogin\n");
            const of2 = fs.readFileSync("file.txt", 'utf8');
            rl.question("Please enter username: ", (input) => {
                user = input;
                rl.question("Please enter password: ", (input) => {
                    pass = input;

                    const lines = of2.split('\n');
                    for (const line of lines) {
                        const [word] = line.split(' ');
                        creds[i] = word;
                        i++;
                        if (i === 2) {
                            i = 0;
                            if (user === creds[0] && pass === creds[1]) {
                                console.log("\t\t\tLogin successful\n\n");
                                console.log("Details: \n");
                                console.log("Username: " + user + "\n");
                                console.log("Password: " + pass + "\n");
                            } else {
                                console.log("Incorrect Credentials!\n\n");
                            }
                        }
                    }
                });
            });
            break;

        case 3:
            i = 0;
            console.log("\t\t\tChange password\n\n");
            const of0 = fs.readFileSync("file.txt", 'utf8');
            rl.question("Please enter the username you want to change the password for: ", (input) => {
                currentusername = input;
                rl.question("Enter the old password: ", (input) => {
                    oldpassword = input;

                    const lines = of0.split('\n');
                    const of1 = fs.createWriteStream("temp.txt");
                    for (const line of lines) {
                        const [word1] = line.split(' ');
                        cp[i] = word1;
                        i++;
                        if (i === 2) {
                            i = 0;
                            if (oldpassword === cp[1] && currentusername === cp[0]) {
                                rl.question("Enter your new password: ", (input) => {
                                    password1 = input;
                                    rl.question("Enter your password again: ", (input) => {
                                        password2 = input;
                                        if (password1 === password2) {
                                            of1.write(`${currentusername}\n${password1}\n`);
                                            console.log("Password changed successfully for user: " + currentusername + "\n");
                                        } else {
                                            console.log("Passwords do not match!\n");
                                            of1.write(`${line}\n`);
                                        }
                                    });
                                });
                            } else {
                                of1.write(`${line}\n`);
                            }
                        }
                    }

                    of1.end();
                    fs.unlinkSync("file.txt");
                    fs.renameSync("temp.txt", "file.txt");
                });
            });
            break;

        case 4:
            console.log("\t\t\tThank YOU!\n\n");
            rl.close();
            break;

        default:
            console.log("Enter a valid choice!\n");
            rl.close();
    }
});
