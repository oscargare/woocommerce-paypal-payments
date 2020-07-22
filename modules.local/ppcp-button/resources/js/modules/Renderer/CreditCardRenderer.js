class CreditCardRenderer {

    constructor(defaultConfig, errorHandler) {
        this.defaultConfig = defaultConfig;
        this.errorHandler = errorHandler;
    }

    render(wrapper, contextConfig) {

        if (
            wrapper === null
            || document.querySelector(wrapper) === null
        ) {
            return;
        }
        if (
            typeof paypal.HostedFields === 'undefined'
            || ! paypal.HostedFields.isEligible()
        ) {
            const wrapperElement = document.querySelector(wrapper);
            wrapperElement.parentNode.removeChild(wrapperElement);
            return;
        }

        //ToDo: Styles
        paypal.HostedFields.render({
            createOrder: contextConfig.createOrder,
            fields: {
                number: {
                    selector: wrapper + ' .ppcp-credit-card',
                    placeholder: this.defaultConfig.hosted_fields.labels.credit_card_number,
                },
                cvv: {
                    selector: wrapper + ' .ppcp-cvv',
                    placeholder: this.defaultConfig.hosted_fields.labels.cvv,
                },
                expirationDate: {
                    selector: wrapper + ' .ppcp-expiration-date',
                    placeholder: this.defaultConfig.hosted_fields.labels.mm_yyyy,
                }
            }
        }).then(hostedFields => {
            document.querySelector(wrapper).addEventListener(
                'submit',
                event => {
                    event.preventDefault();
                    this.errorHandler.clear();
                    const state = hostedFields.getState();
                    const formValid = Object.keys(state.fields).every(function (key) {
                        return state.fields[key].isValid;
                    });

                    if (formValid) {

                        hostedFields.submit({
                            contingencies: ['3D_SECURE']
                        }).then((payload) => {
                            payload.orderID = payload.orderId;
                            return contextConfig.onApprove(payload);
                        });
                    } else {
                        this.errorHandler.message(this.defaultConfig.hosted_fields.labels.fields_not_valid);
                    }
                }
            );
        });
    }
}
export default CreditCardRenderer;