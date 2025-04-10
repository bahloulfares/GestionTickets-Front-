import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Helper from '../../Helper/Helper';
import { getDateServeur } from "../../Redux/Actions/Header/Header";

const FiltreDates = (obj) => {

    const dispatch = useDispatch()
    const messages = useSelector(state => state.intl.messages);
    const HeaderReducer = useSelector(state => state.HeaderReducer)
    const dateDebutRef = useRef(null);
    const dateFinRef= useRef(null);

    useEffect(() => {
        if (!HeaderReducer.dateServeur)
            dispatch(getDateServeur());
    }, [])


    const changeDateDebut = e => {
        let dateDebut = e.currentTarget.value ? new Date(e.currentTarget.value).getTime() : '';
        let userData = { dateDebut: dateDebut };
        if (new Date(e.currentTarget.value).getFullYear() > 1000) obj.customStore.load({ skip: 0, userData: userData })
            .then(
                (data) => { if (data !== undefined) obj.dataGrid.current.instance.refresh(); },
            );
    };
    const changeDateFin = e => {
        let dateFin = e.currentTarget.value ? new Date(e.currentTarget.value).getTime() : '';
        let userData = { dateFin: dateFin };
        if (new Date(e.currentTarget.value).getFullYear() > 1000) obj.customStore.load({ skip: 0, userData: userData })
            .then(
                (data) => { if (data !== undefined) obj.dataGrid.current.instance.refresh(); },
            );
    };
    return (
        <div  className="flex-row-start flex-12 filtreDates">
    <section className="flex-row-space flex-6">
        <label className="control-label flex-2">{messages.Du}</label>
        <div className="control-input flex-10">
        {HeaderReducer.dateServeur && (
             <input
                        id="DateDu"
                        name="DateDu"
                        type="date"
                        className="form-control"
                        defaultValue={Helper.formatDate(Helper.getDateDebut(), 'yyyy-MM-dd')}
                        max="9999-12-31"
                        onChange={changeDateDebut}
                        ref={dateDebutRef}
                    />
              
                )} 
        </div>
    </section>
    <section className="flex-row-space flex-6">
        <label className="control-label flex-2">{messages.Au}</label>
        <div className="control-input flex-10">
        {HeaderReducer.dateServeur && (
                    <input
                        id="DateAu"
                        name="DateAu"
                        type="date"
                        className="form-control"
                            defaultValue={Helper.formatDate(Helper.getDateFin(), 'yyyy-MM-dd')}
                            max="9999-12-31"
                            onChange={changeDateFin}
                        ref={dateFinRef}
                    />
                )}
        </div>
    </section>
</div>
  
  

    );

}

export default FiltreDates