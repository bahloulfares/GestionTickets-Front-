import React from 'react';
import {shallow} from 'enzyme';
import {PrestationAside} from '../Components/Prestation/PrestationAside';

const props =
    {
        getAllMenus: jest.fn(),
        getAllTypePrestations: jest.fn(),
        getAllSousFamillesPrestations: jest.fn(),
        getAllTVA: jest.fn(),
        getAllFamillesFacturations: jest.fn(),
        getAllCostProfitCenter: jest.fn(),
        getAllNatureCenter: jest.fn(),
        getAllNatureAdmission: jest.fn(),
        getAllTypeIntervClinique: jest.fn(),
        getAllTypeInterv: jest.fn(),
        prestationReducer: {
            prestations: [],
            selectedPrestation: null,
            selection: []
        },
        PrestationAsideReducer: {
            isOpen: false,
            modeAside: ''
        },
        MenuTabsReducer: {
            tabs: [
                {
                    key: '0',
                    title: '',
                    icon: {
                        type: 'i',
                        key: null,
                        ref: null,
                        props: {
                            className: 'fas fa-home'
                        },
                        _owner: null
                    },
                    component: {
                        key: null,
                        ref: null,
                        props: {},
                        _owner: null
                    }
                }
            ],
            activeKey: '0'
        },
        MenuReducer: {
            codeModule: 'PC',
            menus: [
                {
                    codMnP: '01',
                    module: 'PC',
                    desMenuP: 'الخدمات الطبية',
                    desMenuPSec: 'Medical services',
                    mnName: 'liste-prestations',
                    logo: 'fas fa-heartbeat',
                    boutonSubMenu: [
                        {
                            codMnP: '0101',
                            module: 'PC',
                            desMenuP: 'الخدمات الطبية',
                            desMenuPSec: 'Medical services',
                            mnName: 'Prestation',
                            logo: 'fas fa-code-branch',
                            descSecParent: 'الخدمات الطبية'
                        }
                    ]
                }
            ]
        },
        HeaderReducer: {
            breadcrumbs: 'الإستقبال',
            configERP: [
                {
                    code: 'central',
                    valeur: 'true',
                    designation: 'is central'
                },
                {
                    code: 'env',
                    valeur: 'CMC',
                    designation: 'environnement'
                },
                {
                    code: 'nbr_chiffre_virg',
                    valeur: '2',
                    designation: 'nombre de chiffre apres la virgule'
                },
                {
                    code: 'test',
                    valeur: 'test',
                    designation: 'test'
                }
            ]
        },
        intl: {
            language: 'ar',
            cookies: {
                changeListeners: [],
                HAS_DOCUMENT_COOKIE: true,
                cookies: {
                    iconSize: '16x16',
                    'jenkins-timestamper-offset': '-3600000',
                    'portainer.pagination_services': '0',
                    'portainer.pagination_service-tasks': '0',
                    'portainer.pagination_containers': '100',
                    NG_TRANSLATE_LANG_KEY: 'ar'
                }
            },
            messages: {
                module: 'قاعدة البيانات',
                home: 'الإستقبال',
                search: 'بحث',
                consult: 'عرض',
                add: 'إضافة',
                edit: 'تعديل',
                save: 'حفظ',
                'delete': 'حذف',
                print: 'طباعة',
                'export': 'تصدير',
                exportAll: 'تصدير كل شيء',
                exportSelected: 'تصدير جميع الصفوف المختارة',
                success: 'ok',
                Fail: 'فشل',
                InvalidPriceAndPercentage: 'الرجاء التثبت من الأسعار و النسب',
                confirmDialogTitle: 'إثبات',
                confirmDialogTextPartOne: 'كل التغييرات سيتم حذفها!',
                confirmDialogTextPartTwo: 'تريد إغلاقه على أية حال؟',
                close: 'أغلق',
                doNotClose: 'لا تغلق',
                InvalidMedicalStaff: 'الرجاء إختيار عنصر طبي'
            },
            direction: 'RTL',
            username: 'a'
        }
    };

describe('PrestationAside Test Suite', () => {
    it('renders without crashing', () => {
        shallow(<PrestationAside {...props}/>);
    });
});