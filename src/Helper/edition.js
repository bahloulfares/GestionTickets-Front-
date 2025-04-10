import { default as axios } from 'csysframework-react/dist/Utils/axiosConfig';
export const exportExcel = (url, nameExcel, setIsLoadPanelVisible) => {
    setIsLoadPanelVisible(true);
    axios({
        method: 'GET',
        url: url,
        responseType: 'blob',
        headers: { 'Content-Type': 'blob' },
        timeout: 1000000
    }).then((response) => {
        setIsLoadPanelVisible(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download',  nameExcel + ".xls");
        document.body.appendChild(link);
        link.click();
    });
} 
export const impression = (url, setIsLoadPanelVisible) => {
    setIsLoadPanelVisible(true);
    axios({
        method: 'GET',
        url: url,
        responseType: 'blob',
        headers: { 'Content-Type': 'blob' },
        timeout: 1000000
    }).then((response) => {
        setIsLoadPanelVisible(false);
        componentImpression(response.data);
    });
}
const componentImpression = (blob) => {
    let url = URL.createObjectURL(blob);
    document.getElementById('iframe_content').src = url;
}