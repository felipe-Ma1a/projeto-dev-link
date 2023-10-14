import { FormEvent, useEffect, useState } from "react";

import { db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { Header } from "../../components/header";
import { Input } from "../../components/input";

import { FiTrash } from "react-icons/fi";
import { LuLink2 } from "react-icons/lu";

interface LinkProps {
  id: string;
  name: string;
  url: string;
  color: string;
  bg: string;
}

export function Admin() {
  const [nameInput, setNameInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [textColorInput, setTextColorInput] = useState("#f1f1f1");
  const [backgroundColorInput, setBackgroundColorInput] = useState("#121212");

  const [links, setLinks] = useState<LinkProps[]>([]);

  useEffect(() => {
    const linksRef = collection(db, "links");
    const queryRef = query(linksRef, orderBy("created", "asc"));

    const unsub = onSnapshot(queryRef, (snapshot) => {
      let list = [] as LinkProps[];

      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          color: doc.data().color,
          bg: doc.data().bg,
        });
      });

      setLinks(list);
    });

    return () => {
      unsub();
    };
  }, []);

  function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (nameInput === "" || urlInput === "") {
      alert("Preencha todos os campos!");
      return;
    }

    addDoc(collection(db, "links"), {
      name: nameInput,
      url: urlInput,
      color: textColorInput,
      bg: backgroundColorInput,
      created: new Date(),
    })
      .then(() => {
        setNameInput("");
        setUrlInput("");
        console.log("CADASTRADO COM SUCESSO!");
      })
      .catch((error) => {
        console.log("ERRO AO CADASTRAR NO BANCO: " + error);
      });
  }

  async function handleDeleteLink(id: string) {
    const docRef = doc(db, "links", id);
    await deleteDoc(docRef);
  }

  return (
    <div className="flex flex-col items-center min-h-screen pb-7 px-2">
      <Header />

      <form
        onSubmit={handleRegister}
        className="flex flex-col mt-8 mb-3 w-full max-w-xl"
      >
        <label className="text-white font-medium my-2 ">Nome do link</label>
        <Input
          placeholder="Digite o nome do link..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <label className="text-white font-medium my-2 ">URL do link</label>
        <Input
          type="url"
          placeholder="Digite a url..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <section className="flex gap-5 my-4 justify-center">
          <div className="flex gap-2 items-center">
            <label className="text-white font-medium my-2 ">Cor do link</label>
            <input
              className="w-9 h-9 cursor-pointer rounded-md"
              type="color"
              value={textColorInput}
              onChange={(e) => setTextColorInput(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-white font-medium my-2">Fundo do link</label>
            <input
              className="w-9 h-9 cursor-pointer rounded-md"
              type="color"
              value={backgroundColorInput}
              onChange={(e) => setBackgroundColorInput(e.target.value)}
            />
          </div>
        </section>

        {nameInput !== "" && (
          <div className="flex flex-col items-center justify-center mb-7 p-1 border-gray-100/25 border rounded-md">
            <label className="text-white font-medium my-2 ">
              Veja como está ficando:
            </label>
            <article
              className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3"
              style={{ marginBlock: 8, backgroundColor: backgroundColorInput }}
            >
              <p style={{ color: textColorInput }}>{nameInput}</p>
            </article>
          </div>
        )}

        <button
          type="submit"
          className="mb-7 bg-blue-600 h-9 rounded-md text-white font-medium gap-1 flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          Cadastrar
          <LuLink2 size={22} />
        </button>
      </form>

      <h2 className="font-bold text-white mb-4 text-2xl">Meus Links</h2>

      {links.map((link) => (
        <article
          key={link.id}
          className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
          style={{ backgroundColor: link.bg, color: link.color }}
        >
          <p>{link.name}</p>
          <div>
            <button
              onClick={() => handleDeleteLink(link.id)}
              className="border border-dashed rounded p-1 bg-neutral-900"
            >
              <FiTrash size={18} color="#FFF" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
