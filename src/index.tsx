import * as React from "react";
import { registerWidget, registerLink, registerUI, IContextProvider, } from './uxp';
import { TitleBar, FilterPanel, WidgetWrapper, DataList, Label, Button, Input, IconButton, Modal } from "uxp/components";
import './styles.scss';

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}
interface ILockerType {
    _id: string;
    id: string;
    value: string;
}

const LockerTypeWidget: React.FunctionComponent<IWidgetProps> = (props) => {
    let [lockerCategory, setLockerCategory] = React.useState<ILockerType[]>([]);
    let [showModel, setShowModel] = React.useState(false);
    let [edit, setEdit] = React.useState<string>(null);
    let [editValue, setEditValue] = React.useState<string>(null);
    let [newID, setNewID] = React.useState<string>(null);
    let [newValue, setNewValue] = React.useState<string>(null);
    React.useEffect(() => {
        getLockerTypes();
    }, []);
    function getLockerTypes() {
        props.uxpContext.executeAction('LockerManagement', 'AllLockerTypes', {}, { json: true })
            .then((data: any) => {
                setLockerCategory(data);
            })
    }
    function updateValue(value: any) {
        console.log(value);
        setEditValue(value);
    }
    function saveValue(_id: string, id: string, value: string) {
        props.uxpContext.executeAction('LockerManagement', 'UpdateLockerType', { _id, id, value })
            .then((res) => {
                //this will execute on success
                setEdit(null);
                setEditValue(null);
                getLockerTypes();
            })
            .catch((error) => {
                console.log(error);
            })
    }
    function addValue(id: string, value: string) {
        props.uxpContext.executeAction('LockerManagement', 'addLockerType', { id, value })
            .then((res) => {
                //this will execute on success
                setNewID(null);
                setNewValue(null);
                getLockerTypes();
            })
            .catch((error) => {
                console.log(error);
            })
    }
    function deleteValue(_id: string) {
        props.uxpContext.executeAction('LockerManagement', 'DeleteLockerType', { _id })
            .then((res) => {
                //this will execute on success
                getLockerTypes();
            })
            .catch((error) => {
                console.log(error);
            })
    }


    return (
        <WidgetWrapper>
            <TitleBar title='LockerType'>
                <FilterPanel>
                </FilterPanel>
            </TitleBar>
            <IconButton type="close" className="addType" onClick={() => { setShowModel(true) }}></IconButton>
            <Modal show={showModel} onClose={() => setShowModel(false)} >
                <table>
                    <tr>
                        <th>
                            id
                        </th>
                        <th>
                            value
                        </th>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" value={newID} onChange={(event) => setNewID(event.target.value)} />
                        </td>
                        <td>
                            <input type="text" value={newValue} onChange={(event) => setNewValue(event.target.value)} />
                        </td>
                        <td>
                            <IconButton type="done" onClick={() => { addValue(newID, newValue), setShowModel(false) }}></IconButton>
                            <IconButton type="close" onClick={() => { setNewID(null), setNewValue(null), setShowModel(false) }}></IconButton>
                        </td>
                    </tr>
                </table>
            </Modal>

            <table>
                <tr>
                    <th>label</th>
                    <th>value</th>
                </tr>
                {

                    lockerCategory.map((item) => {
                        return (


                            <tr>
                                <td>
                                    {edit == `${item._id}-label`
                                        ? <div className="tableItem">
                                            <Input type="text" value={editValue} onChange={updateValue}></Input>
                                            <IconButton type="done" onClick={() => { saveValue(item._id, editValue, item.value) }}></IconButton>
                                            <IconButton type="close" onClick={() => { setEdit(null); setEditValue(null); }}></IconButton>
                                            <IconButton type="delete" onClick={() => { deleteValue(item._id) }}></IconButton>
                                        </div>
                                        : <div onClick={() => {
                                            setEditValue(item.id);
                                            setEdit(`${item._id}-label`)
                                        }}>{item.id}</div>}
                                </td>
                                <td>
                                    {edit == `${item._id}-value`
                                        ? <div className="tableItem">
                                            <Input type="text" value={editValue} onChange={updateValue}></Input>
                                            <IconButton type="done" onClick={() => { saveValue(item._id, item.id, editValue) }}></IconButton>
                                            <IconButton type="close" onClick={() => { setEdit(null); setEditValue(null); }}></IconButton>
                                            <IconButton type="delete" onClick={() => { deleteValue(item._id) }}></IconButton>
                                        </div>
                                        : <div onClick={() => {
                                            setEditValue(item.value);
                                            setEdit(`${item._id}-value`)
                                        }}>{item.value}</div>}
                                </td>

                            </tr>


                        )

                    })
                }
            </table>

        </WidgetWrapper>
    )
};

/**
 * Register as a Widget
 */
registerWidget({
    id: "LockerType",
    widget: LockerTypeWidget,
    configs: {
        layout: {
            // w: 12,
            // h: 12,
            // minH: 12,
            // minW: 12
        }
    }
});

/**
 * Register as a Sidebar Link
 */
/*
registerLink({
    id: "LockerType",
    label: "LockerType",
    // click: () => alert("Hello"),
    component: LockerTypeWidget
});
*/

/**
 * Register as a UI
 */

/*
registerUI({
   id:"LockerType",
   component: LockerTypeWidget
});
*/