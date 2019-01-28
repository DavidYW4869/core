import { TransactionTypes } from "../../../../constants";
import { Engine } from "../../../engine";

export const timelockTransfer = transaction => {
    const { error, value } = Engine.validate(
        transaction,
        Engine.joi.object({
            id: Engine.joi
                .string()
                .alphanum()
                .required(),
            // @ts-ignore
            blockid: Engine.joi.alternatives().try(Engine.joi.blockId(), Engine.joi.number().unsafe()),
            type: Engine.joi.number().valid(TransactionTypes.TimelockTransfer),
            timestamp: Engine.joi
                .number()
                .integer()
                .min(0)
                .required(),
            amount: Engine.joi
                .alternatives()
                .try(
                    Engine.joi
                        .bignumber()
                        .integer()
                        .min(0),
                    Engine.joi
                        .number()
                        .integer()
                        .min(0),
                )
                .required(),
            fee: Engine.joi
                .alternatives()
                .try(
                    Engine.joi
                        .bignumber()
                        .integer()
                        .positive(),
                    Engine.joi
                        .number()
                        .integer()
                        .positive(),
                )
                .required(),
            senderId: Engine.joi.address(),
            recipientId: Engine.joi.address().required(),
            senderPublicKey: Engine.joi.publicKey().required(),
            signature: Engine.joi
                .string()
                .alphanum()
                .required(),
            signatures: Engine.joi.array(),
            secondSignature: Engine.joi.string().alphanum(),
            asset: Engine.joi.object().required(),
            vendorField: Engine.joi.string().max(64, "utf8"),
            confirmations: Engine.joi
                .number()
                .integer()
                .min(0),
        }),
        {
            allowUnknown: true,
        },
    );

    return {
        data: value,
        errors: error ? error.details : null,
        passes: !error,
        fails: error,
    };
};