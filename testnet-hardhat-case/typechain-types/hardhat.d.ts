/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IAction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAction__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IMoneyPoolRaw",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IMoneyPoolRaw__factory>;
    getContractFactory(
      name: "ISigmaAction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISigmaAction__factory>;
    getContractFactory(
      name: "Action",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Action__factory>;
    getContractFactory(
      name: "MoneyPoolV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MoneyPoolV2__factory>;
    getContractFactory(
      name: "MoneyPoolRaw",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MoneyPoolRaw__factory>;
    getContractFactory(
      name: "MultiSig",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MultiSig__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "TestTokenCZK",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestTokenCZK__factory>;
    getContractFactory(
      name: "SigmaAction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SigmaAction__factory>;
    getContractFactory(
      name: "SigmaPoolV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SigmaPoolV2__factory>;

    getContractAt(
      name: "IAction",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAction>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IMoneyPoolRaw",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IMoneyPoolRaw>;
    getContractAt(
      name: "ISigmaAction",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ISigmaAction>;
    getContractAt(
      name: "Action",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Action>;
    getContractAt(
      name: "MoneyPoolV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.MoneyPoolV2>;
    getContractAt(
      name: "MoneyPoolRaw",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.MoneyPoolRaw>;
    getContractAt(
      name: "MultiSig",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.MultiSig>;
    getContractAt(
      name: "ERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "TestTokenCZK",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TestTokenCZK>;
    getContractAt(
      name: "SigmaAction",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SigmaAction>;
    getContractAt(
      name: "SigmaPoolV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SigmaPoolV2>;

    deployContract(
      name: "IAction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAction>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "IMoneyPoolRaw",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IMoneyPoolRaw>;
    deployContract(
      name: "ISigmaAction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISigmaAction>;
    deployContract(
      name: "Action",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Action>;
    deployContract(
      name: "MoneyPoolV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MoneyPoolV2>;
    deployContract(
      name: "MoneyPoolRaw",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MoneyPoolRaw>;
    deployContract(
      name: "MultiSig",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MultiSig>;
    deployContract(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "TestTokenCZK",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestTokenCZK>;
    deployContract(
      name: "SigmaAction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SigmaAction>;
    deployContract(
      name: "SigmaPoolV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SigmaPoolV2>;

    deployContract(
      name: "IAction",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAction>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "IMoneyPoolRaw",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IMoneyPoolRaw>;
    deployContract(
      name: "ISigmaAction",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISigmaAction>;
    deployContract(
      name: "Action",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Action>;
    deployContract(
      name: "MoneyPoolV2",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MoneyPoolV2>;
    deployContract(
      name: "MoneyPoolRaw",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MoneyPoolRaw>;
    deployContract(
      name: "MultiSig",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MultiSig>;
    deployContract(
      name: "ERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "IERC20Metadata",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "TestTokenCZK",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestTokenCZK>;
    deployContract(
      name: "SigmaAction",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SigmaAction>;
    deployContract(
      name: "SigmaPoolV2",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SigmaPoolV2>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.Contract>;
  }
}