import { useState, useEffect } from 'react'
import TreeView from '@mui/lab/TreeView'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ViewListIcon from '@mui/icons-material/ViewList'
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EvStationIcon from '@mui/icons-material/EvStation';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import SpaIcon from '@mui/icons-material/Spa'
import BuildIcon from '@mui/icons-material/Build'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import TuneIcon from '@mui/icons-material/Tune';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import InsightsIcon from '@mui/icons-material/Insights';
import ApprovalIcon from '@mui/icons-material/Approval';
import SwipeRightIcon from '@mui/icons-material/SwipeRight';
import { Divider } from '@mui/material'
import Link from 'next/link'
import getTranslation from '../../../locales/getTranslation'

import TreeItem from '@mui/lab/TreeItem';

export default function TreeListMenu(props) {

  const [permList, setPermList] = useState('00000000000000000000000000000000000000000000000000000000000000000')

  useEffect(() => {
    async function fetchData() {
      setPermList(sessionStorage.getItem('Permissions'))
    }
    fetchData()
  }, [])

  const t = getTranslation()

  function handleToggle(event, nodes) {
    props.setExpanded(nodes)
  }

  const p = permList.split('').map(perm => {
    return Number.parseInt(perm)
  })

  return (
    <TreeView
      aria-label="file system navigator"
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto', color: "#305E79" }}
      expanded={props.expanded}
      onNodeToggle={handleToggle}
    >
      <TreeItem hidden={!p[0]} nodeId="1" label={t["app.sidenav.purchasing"]} icon={<ShoppingCartIcon />}>
        <Link href={'/purchasing/purchase-request/new'} passHref>
          <TreeItem hidden={!p[1]} nodeId="1.1" label={t["app.purchasing.purchase-request.title"]} icon={<RequestQuoteIcon />} />
        </Link>
        <Link href={'/purchasing/purchase-request/list'} passHref>
          <TreeItem hidden={!p[2]} nodeId="1.2" label={t["app.purchasing.purchase-request.report"]} icon={<ViewListIcon />} />
        </Link>
        <Link href={'/purchasing/purchase-delivery-notes/open-purchase-orders'} passHref>
          <TreeItem hidden={!p[3]} nodeId="1.3" label={t["app.purchasing.purchase-delivery-notes.create"]} icon={<CallReceivedIcon />} />
        </Link>
        <Link href={'/purchasing/purchase-delivery-notes/list'} passHref>
          <TreeItem hidden={!p[4]} nodeId="1.4" label={t["app.purchasing.purchase-delivery-notes.report"]} icon={<ViewListIcon />} />
        </Link>
      </TreeItem>
      <Divider />

      <TreeItem hidden={!p[0]} nodeId="6" label={t["app.origin-and-dispatch.title"]} icon={<LocalShippingIcon />}>
        <Link href={'/origin-and-dispatch/goods-received-note/new'} passHref>
          <TreeItem hidden={!p[1]} nodeId="6.1" label={t["app.origin-and-dispatch.goods-received-note.title"]} icon={<ContentPasteGoIcon />} />
        </Link>
        <Link href={'/origin-and-dispatch/goods-received-note/list'} passHref>
          <TreeItem hidden={!p[7]} nodeId="6.2" label={t["app.origin-and-dispatch.goods-received-note.list"]} icon={<ViewListIcon />} />
        </Link>
      </TreeItem>
      <Divider />


      <TreeItem hidden={!p[5]} nodeId="2" label={t["app.agricultural.title"]} icon={<AgricultureIcon />}>
        <Link href={'/agricultural/harvest-ticket/new'} passHref>
          <TreeItem hidden={!p[6]} nodeId="2.1" label={t["app.agricultural.harvest-ticket.title"]} icon={<ContentPasteGoIcon />} />
        </Link>
        <Link href={'/agricultural/harvest-ticket/list'} passHref>
          <TreeItem hidden={!p[7]} nodeId="2.2" label={t["app.agricultural.harvest-ticket.list"]} icon={<ViewListIcon />} />
        </Link>
        <Link href={'/agricultural/packing-list/new'} passHref>
          <TreeItem hidden={!p[8]} nodeId="2.3" label={t["app.agricultural.packing-list.title"]} icon={<RequestQuoteIcon />} />
        </Link>
        <Link href={'/agricultural/packing-list/list'} passHref>
          <TreeItem hidden={!p[9]} nodeId="2.4" label={t["app.agricultural.packing-list.list"]} icon={<ViewListIcon />} />
        </Link>
        <TreeItem hidden={!p[10]} nodeId="2.5" label={t["app.agricultural.stock-transfer"]} icon={<InventoryIcon />}>
          <Link href={'/agricultural/stock-transfer/transfer-delivery-notes/list'} passHref>
            <TreeItem hidden={!p[11]} nodeId="2.5.1" label={t["app.agricultural.transfer-delivery-notes"]} icon={<ArrowForwardIcon />} />
          </Link>
          <Link href={'/agricultural/stock-transfer/transfer-purchase-delivery-notes/list'} passHref>
            <TreeItem hidden={!p[12]} nodeId="2.5.2" label={t["app.agricultural.transfer-purchase-delivery-notes"]} icon={<ArrowBackIcon />} />
          </Link>
          <TreeItem hidden={!p[13]} nodeId="2.5.3" label={t["app.sidenav.inventory-transfer-request"]} icon={<MoveDownIcon />}>
            <Link href={'/agricultural/stock-transfer/inventory-transfer-request/new'} passHref>
              <TreeItem hidden={!p[14]} nodeId="2.5.3.1" label={t["app.sidenav.inventory-transfer-request"]} icon={<MoveDownIcon />} />
            </Link>
            <Link href={'/agricultural/stock-transfer/inventory-transfer-request/list'} passHref>
              <TreeItem hidden={!p[15]} nodeId="2.5.2" label={t["app.sidenav.inventory-transfer-request.list"]} icon={<ViewListIcon />} />
            </Link>
          </TreeItem>
        </TreeItem>
        <TreeItem hidden={!p[16]} nodeId="2.6" label={t["app.agricultural.fuel-and-lubrification"]} icon={<EvStationIcon />}>
          <Link href={'/agricultural/fuel-and-lubrification/new'} passHref>
            <TreeItem hidden={!p[17]} nodeId="2.6.1" label={t["app.agricultural.fuel-and-lubrification"]} icon={<EvStationIcon />} />
          </Link>
          <Link href={'/agricultural/fuel-and-lubrification/list'} passHref>
            <TreeItem hidden={!p[18]} nodeId="2.6.2" label={t["app.agricultural.fuel-and-lubrification.list"]} icon={<ViewListIcon />} />
          </Link>
          <Link href={'/agricultural/fuel-and-lubrification/list-stock'} passHref>
            <TreeItem hidden={!p[19]} nodeId="2.6.3" label={t["app.agricultural.fuel-and-lubrification.list-stock"]} icon={<ViewListIcon />} />
          </Link>
        </TreeItem>
        <TreeItem hidden={!p[20]} nodeId="2.8" label={t["app.agricultural.operation"]} icon={<SpaIcon />}>
          <Link href={'/agricultural/operations/agricultural-operation/new'} passHref>
            <TreeItem hidden={!p[21]} nodeId="2.8.1" label={t["app.agricultural.operation"]} icon={<SpaIcon />} />
          </Link>
          <Link href={'/agricultural/operations/agricultural-operation/list'} passHref>
            <TreeItem hidden={!p[22]} nodeId="2.8.2" label={t["app.agricultural.operation-list"]} icon={<ViewListIcon />} />
          </Link>
          <Link href={'/agricultural/operations/seed-treatment/new'} passHref>
            <TreeItem hidden={!p[21]} nodeId="2.8.3" label={'Tratamento de Sementes'} icon={<SpaIcon />} />
          </Link>
          <Link href={'/agricultural/operations/seed-treatment/list'} passHref>
            <TreeItem hidden={!p[22]} nodeId="2.8.4" label={'Lista Tratamento de Sementes'} icon={<ViewListIcon />} />
          </Link>
        </TreeItem>
        <TreeItem hidden={!p[13]} nodeId="2.5.3" label={t["app.agricultural.field-control"]} icon={<TuneIcon />}>
          <Link href={'/agricultural/field-control/weather-note/new'} passHref>
            <TreeItem hidden={!p[14]} nodeId="2.5.3.1" label={t["app.agricultural.field-control.weather-note"]} icon={<DeviceThermostatIcon />} />
          </Link>
          <Link href={'/agricultural/field-control/weather-note/list'} passHref>
            <TreeItem hidden={!p[14]} nodeId="2.5.3.2" label={t["app.agricultural.field-control.weather-note-list"]} icon={<ViewListIcon />} />
          </Link>
          <Link href={'/agricultural/field-control/production-analisys/new'} passHref>
            <TreeItem hidden={!p[15]} nodeId="2.5.3.3" label={t["app.agricultural.field-control.production-analisys"]} icon={<InsightsIcon />} />
          </Link>
        </TreeItem>
      </TreeItem>
      <Divider />
      <TreeItem hidden={!p[23]} nodeId="3" label={t["app.sidenav.stockroom"]} icon={<BuildIcon />}>
        <Link href={'/stockroom/warehouse-exit/new'} passHref>
          <TreeItem hidden={!p[24]} nodeId="3.1" label={t["app.stockroom.warehouse-exit"]} icon={<ExitToAppIcon />} />
        </Link>
        <Link href={'/stockroom/warehouse-exit/list'} passHref>
          <TreeItem hidden={!p[25]} nodeId="3.2" label={t["app.stockroom.warehouse-exit.list"]} icon={<ViewListIcon />} />
        </Link>
        <Link href={'/stockroom/stock-list/stock-list'} passHref>
          <TreeItem hidden={!p[25]} nodeId="3.3" label="Lista de Estoque" icon={<ViewListIcon />} />
        </Link>
      </TreeItem>

      <Divider />
      <TreeItem hidden={!p[1]} nodeId="30" label='Autorizações' icon={<ApprovalIcon />}>
        <Link href={'/approval-requests/list'} passHref>
          <TreeItem hidden={!p[1]} nodeId="30.1" label="Pedidos de aprovação" icon={<SwipeRightIcon />} />
        </Link>
      </TreeItem>

    </TreeView>
  );
}