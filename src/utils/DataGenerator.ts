import { faker } from "@faker-js/faker";

/**
 * DataGenerator
 *
 * Thin wrapper around @faker-js/faker that exposes ready-to-use random
 * test data. Every method is static, so call it directly without creating
 * an instance, e.g. `DataGenerator.firstName()`.
 */
export class DataGenerator {
    /* ------------------------------------------------------------------ */
    /* Person                                                             */
    /* ------------------------------------------------------------------ */

    // Purpose : Generate a random first name
    static firstName(sex?: "male" | "female"): string {
        return faker.person.firstName(sex);
    }

    // Purpose : Generate a random last name
    static lastName(sex?: "male" | "female"): string {
        return faker.person.lastName(sex);
    }

    // Purpose : Generate a random full name (first + last)
    static fullName(sex?: "male" | "female"): string {
        return faker.person.fullName({ sex });
    }

    // Purpose : Generate a random job title
    static jobTitle(): string {
        return faker.person.jobTitle();
    }

    // Purpose : Generate a random gender
    static gender(): string {
        return faker.person.sex();
    }

    /* ------------------------------------------------------------------ */
    /* Contact                                                            */
    /* ------------------------------------------------------------------ */

    // Purpose : Generate a unique email. Pass first/last name to base it on them.
    static email(firstName?: string, lastName?: string): string {
        return faker.internet.email({ firstName, lastName, provider: "example.com" }).toLowerCase();
    }

    // Purpose : Generate a guaranteed-unique email using a timestamp suffix
    static uniqueEmail(prefix = "test"): string {
        return `${prefix}.${Date.now()}.${faker.string.alphanumeric(5)}@example.com`.toLowerCase();
    }

    // Purpose : Generate a random phone number (optionally formatted)
    static phoneNumber(format = "##########"): string {
        return faker.phone.number({ style: "national" }).replace(/\D/g, "").slice(0, format.length);
    }

    // Purpose : Generate a random username
    static username(): string {
        return faker.internet.username();
    }

    // Purpose : Generate a random strong-ish password
    static password(length = 12): string {
        return faker.internet.password({ length, memorable: false });
    }

    /* ------------------------------------------------------------------ */
    /* Address                                                            */
    /* ------------------------------------------------------------------ */

    // Purpose : Generate a random street address
    static streetAddress(): string {
        return faker.location.streetAddress();
    }

    // Purpose : Generate a random city
    static city(): string {
        return faker.location.city();
    }

    // Purpose : Generate a random state
    static state(abbreviated = false): string {
        return faker.location.state({ abbreviated });
    }

    // Purpose : Generate a random zip / postal code
    static zipCode(): string {
        return faker.location.zipCode();
    }

    // Purpose : Generate a random country
    static country(): string {
        return faker.location.country();
    }

    // Purpose : Generate a full address object
    static fullAddress(): {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    } {
        return {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country(),
        };
    }

    static personInfo(): {
        firstName: string;
        lastName: string;
        gender: string;
        email: string;
        username: string;
        password: string;
    } {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        return {
            firstName,
            lastName,
            gender: faker.person.sex(),
            email: DataGenerator.email(firstName, lastName),
            username: faker.internet.username({ firstName, lastName }),
            password: DataGenerator.password(),
        };
    }
}
