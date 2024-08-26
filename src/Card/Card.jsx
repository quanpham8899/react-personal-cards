import { useEffect, useRef, useState, createContext} from 'react';
import styles from './Card.module.css';
import App from '../App.js';

export const userNameContext = createContext();

function Card({onDelete,id}) {

    const [optionConfirm, setOptionConfirm] = useState(false);

    const [inputDisable, setInputDisable] = useState(true);

    const [validEmail, setValidEmail] = useState(true );
    const [validPhone, setValidPhone] = useState(true);

    const [imageSrc, setImageSrc] = useState("https://via.placeholder.com/130");
    const [name, setName] = useState("Guest");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // memory for previous value
    const [prevName, setPrevName] = useState("");
    const [prevEmail, setPrevEmail] = useState("");
    const [prevPhone, setPrevPhone] = useState("");
    const [prevAddress, setPrevAddress] = useState("");
    
    const inputName = useRef(null);
    const inputEmail = useRef(null);
    const inputPhone = useRef(null);
    const inputAddress = useRef(null);
    const fileInput = useRef(null);

    const onEditBackgroundColor = "antiquewhite";       // Base on the CSS
    let defaultInputBackgroundColor = "";
    let warning = "Can't be empty";
    let imageStyles_Active = {
        border: "2px solid black",
        cursor: "pointer",
        backgroundColor: "rgba(0,0,0)"
    };

    console.log("Card is is: " + id);

    // -----------

    useEffect(() => {
        if (inputEmail !== null) {
            defaultInputBackgroundColor = window.getComputedStyle(inputEmail.current).getPropertyValue('background-color');
        }

        if (defaultInputBackgroundColor == '') {
            console.warn("Failed to get defaultBackgroundColor this may failed to do something I don't fucking know or just to lazy to type why hihi")
        }
        return () => {

        };
    }, []);

    useEffect(() => {
        if (!inputDisable) {
            inputName.current?.focus();
        }
        changeInputBackgroundColor(inputEmail.current, !inputDisable ? onEditBackgroundColor : defaultInputBackgroundColor);
        changeInputBackgroundColor(inputPhone.current, !inputDisable ? onEditBackgroundColor : defaultInputBackgroundColor);
        changeInputBackgroundColor(inputAddress.current, !inputDisable ? onEditBackgroundColor : defaultInputBackgroundColor);

    }, [inputDisable]);

    // -----------

    const handleEmailChanged = (e) => {
        setEmail(e.target.value);
    };

    const handlePhoneChanged = (e) => {
        setPhone(e.target.value);
    };

    const handleAddressChanged = (e) => {
        setAddress(e.target.value);
    };

    const handleNameChanged = (e) => {
        setName(e.target.value);
    };

    function deleteConfirm(onDelete) {
        const _confirm = window.confirm(`Delete card ${name}?`);
        if (_confirm) {
            if (typeof onDelete === 'function')
                onDelete.call();
        }
    }

    const changeInputBackgroundColor = (element, targetColor) => {
        if (element == null) {
            console.error("There was no element to change background-color. Huhu");
            return;
        }

        let _style = element.style;
        if (_style !== null) {
            _style.backgroundColor = targetColor;
        }
    };

    function onEditButton() {
        setInputDisable(false);

        setPrevName(name);
        setPrevEmail(email);
        setPrevPhone(phone);
        setPrevAddress(address);
        
        setValidEmail(true);
        setValidPhone(true);

        setOptionConfirm(true);
    }

    // For Accept and Cancel 
    function onEditPerformed(isSubmit) {
        if (!isSubmit) {
            setName(prevName);
            setEmail(prevEmail);
            setPhone(prevPhone);
            setAddress(prevAddress);
        } else {
            const _validName = name.trim().length !== 0;
            const _validEmail = isValidEmail(email);
            const _validPhone = isValidTelephone(phone);

            setValidEmail(_validEmail);
            setValidPhone(_validPhone);

            const _valid = _validName && _validEmail && _validPhone;

            if (!_validName) {
                setName("[Empty name]");
            } 

            if (!_validEmail) {
                setEmail("");
            }

            if (!_validPhone) {
                setPhone("");
            }
        }

        setInputDisable(true);
        setOptionConfirm(false);
    }

    function onImageClick(e) {
        if (inputDisable) return;
        fileInput?.current.click();
    }

    function handleFileChanged(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result); 
            };
            reader.readAsDataURL(file); 
            console.log(file);
        }
    }

    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    function isValidTelephone(phone) {
        const regex = /^(?:\d{1,3})?\s?(?:\d{1,4}[\s.-]?)?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;
        return regex.test(phone);
    }

    return (
        <>
            <div className={styles.card}>
                <input 
                    type="file" 
                    accept='image/*'
                    ref={fileInput}
                    onChange={(event) => handleFileChanged(event)}
                    style={{display: "none"}}
                    />
                <img 
                    className={styles["card-avatar"]} 
                    src={imageSrc} alt="" 
                    title={inputDisable ? "" : "Change Avatar"}
                    style={inputDisable ? {} : imageStyles_Active}
                    onClick={onImageClick}
                    />
                <input
                    ref={inputName}
                    className={styles["card-name"]}
                    type="text"
                    value={name}
                    onChange={handleNameChanged}
                    disabled={inputDisable}
                    required
                />
                <div className={`${styles["card-info"]} ${styles.email}`}>
                    <span>Email: </span>
                    <input
                        ref={inputEmail}
                        disabled={inputDisable}
                        className={styles["email-context"]}
                        type="text"
                        placeholder={!validEmail ? "Incorrect email format" : ""}
                        value={email}
                        onChange={handleEmailChanged} />
                </div>
                <div className={`${styles["card-info"]} ${styles.phone}`}>
                    <span>Phone: </span>
                    <input
                        ref={inputPhone}
                        disabled={inputDisable}
                        type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"     // For telephone format
                        value={phone}
                        placeholder={!validPhone ? "Incorrect phone format" : ""}
                        onChange={handlePhoneChanged} />
                </div>
                <div className={`${styles["card-info"]} ${styles.address}`}>
                    <span>Address: </span><br />
                    <div >
                        <textarea className={styles["address-context"]}
                            ref={inputAddress}
                            disabled={inputDisable}
                            value={address}
                            onChange={handleAddressChanged} />
                    </div>
                </div>
                <div className={styles["card-action"]}>
                    <button
                        className={styles["button-delete"]}
                        style={{ display: optionConfirm ? "none" : "block" }}
                        onClick={() => deleteConfirm(onDelete)}>
                        Delete
                    </button>
                    <button
                        onClick={onEditButton}
                        className={styles["button-edit"]}
                        style={{ display: optionConfirm ? "none" : "block" }}>
                        Edit
                    </button>
                    <button
                        className={styles["button-accept"]}
                        style={{ display: optionConfirm ? "block" : "none" }}
                        onClick={() => onEditPerformed(true)}>
                        Accept
                    </button>
                    <button
                        className={styles["button-cancel"]}
                        style={{ display: optionConfirm ? "block" : "none" }}
                        onClick={() => onEditPerformed(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
}

export default Card;