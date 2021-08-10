
export default function useDate() {

    const edtf0Mask = '####-##-##'
    const edtf0Rule =  v => v === '' || /^(\d{4})(-[0-1]\d)?(-[0-3]\d)?(\/(\d{4})(-[0-1]\d)?(-[0-3]\d)?)?$/.test(v)

    return {edtf0Mask, edtf0Rule}
}
