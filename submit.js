function countNumbersWith42InRange(start, end) {
    let count = 0;

    for (let i = start; i <= end; i++) {
        const digits = String(i);

        if (digits.includes('42')) {
            count++;
        }
    }

    return count;
}

const start = 42698;
const end = 842000;
const count = countNumbersWith42InRange(start, end);

console.log(`区间[${start}, ${end}]中包含数字42的数量为: ${count}`);